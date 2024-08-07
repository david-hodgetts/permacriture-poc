import { readFileSync, writeFileSync } from 'fs';
import { Terrain, TerrainJSON, ingestTerrainData, UserAuthorPair, dayDateToDate, cryptonimToUserAuthorPair } from "./bootstrapHandler/bootstrapModel";
import { Strapi } from '@strapi/strapi';



async function createUserAuthorPair(
    userAuthorPair: UserAuthorPair,
    terrainId: number
): Promise<{userId: number, authorId: number}>
{
    let newUser = null;
    try{
        newUser = await strapi.plugins['users-permissions'].services.user.add({
            blocked: false,
            confirmed: true,
            username: userAuthorPair.user.username,
            email: userAuthorPair.user.email,
            password: userAuthorPair.user.password, //will be hashed automatically
            provider: 'local', //provider
            created_by: 1, //user admin id
            updated_by: 1, //user admin id
            role: 1 //role id
        });
    }catch(e){
        console.error("unable to create user ->", e);
        throw new Error("User Creation error");
    }

    // create author

    const author = await strapi.db.query('api::author.author').create({
        data: {
            nickname: userAuthorPair.author.nickname,
            user: newUser.id,
            terrain: terrainId
        },
        populate: ['user', 'terrain'],
    });

    return {
        userId: newUser.id,
        authorId: author.id
    }
}

/**
 * delete terrain and authors, graines
 * @param terrainId
 * @param createdUserAuthors
 */
async function cancelTerrainCreation(
    terrainId: number,
    createdUserAuthors: { userId: number; authorId: number; }[],
    strapi: Strapi)
{
    try{
        console.log("removing contributions for terrain id", terrainId);
        // 1 remove contributions
        // deleteMany on terrain do not work WTF!!
        // so we get the contrib list and delete them in second step :(
        const contributions = await strapi.db.query("api::contribution.contribution").findMany({
            where: {
                'terrain': terrainId,
            },
            populate: ["terrain"],
        });

        for(const contribution of contributions){
            console.log("removing contribution with id", contribution.id);
            await strapi.db.query("api::contribution.contribution").delete({
                where:{
                    id: contribution.id,
                }
            });
        }

        // 2 remove user/author pairs
        for(const userAuthorPairIds of createdUserAuthors){
            console.log("removing author with id", userAuthorPairIds.userId);
            await strapi.db.query("api::author.author").delete({
                where: {
                    id: userAuthorPairIds.authorId
                },
            });
            console.log("removing user with id", userAuthorPairIds.userId);
            await strapi.query('plugin::users-permissions.user').delete({
                where:{
                    id: userAuthorPairIds.userId
                }
            });
        }

        // 3 remove terrain
        await strapi.db.query("api::terrain.terrain").delete({
            where: {
                id: terrainId
            },
        });
    }catch(e){
        console.error("error while cancelling terrain creation", e);
        console.error("aborting process");
        process.exit(1);
    }

    console.log(`successully removed terrain with id ${terrainId} and associated data`);
}

export async function terrainWithTitleExists(terrainTitle:string): Promise<boolean>{

    const strapiTerrain = await strapi.db.query('api::terrain.terrain').findOne({
        select: ['title'],
        where: { title: terrainTitle },
    });

    return !!strapiTerrain;
}

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register(/*{ strapi }*/) { },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi: Strapi }) {

        let terrainsJson: TerrainJSON[];
        try{
            terrainsJson = JSON.parse(readFileSync("./bootstrapData.json", { encoding: 'utf-8' })) as TerrainJSON[];
        }catch(e){
            console.error("failed to read json file for terrain ingestion", e);
            process.exit(1);
        }

        console.log("-----------------------------");
        console.log("Starting bootstrap process");
        console.log("ingesting new terrains...");

        for (const terrainJson of terrainsJson){
            // 1. does the terrain exist

            const terrainExists = await terrainWithTitleExists(terrainJson.title);

            if(!terrainExists){
                let terrain: Terrain;
                try{
                    terrain = ingestTerrainData(terrainJson);
                }catch(e){
                    console.error("failed to ingest json data for terrain with title", terrainJson.title);
                    console.error(e);
                    process.exit(1);
                }
                console.log("found new terrain with title ->", terrain.title);

                const newTerrain = await strapi.db.query('api::terrain.terrain').create({
                    data:{
                        title: terrain.title,
                        slug: terrain.slug,
                        description: terrain.description,
                        start: dayDateToDate(terrain.start),
                        end: dayDateToDate(terrain.end),
                        contribution_min_publication_delay_minutes: terrain.contribution_min_publication_delay_minutes,
                        contribution_max_publication_delay_minutes: terrain.contribution_max_publication_delay_minutes,
                    }
                });

                // use this collection to collect all user/author pairs
                // useful if we must rollbak and delete newly created user/authors
                let createdUserAuthors:{userId: number, authorId: number }[] = [];

                // add users
                for (const cryptonim of terrain.cryptonims) {
                    console.log("create user from cryptonim", cryptonim);
                    try{
                        const userAuthorPair = await cryptonimToUserAuthorPair(cryptonim);
                        terrain.users.push(userAuthorPair);
                        const userAuthorIds = await createUserAuthorPair(userAuthorPair, newTerrain.id);
                        createdUserAuthors.push(userAuthorIds);
                    }catch(e){
                        console.error("error creating user author pair");
                        await cancelTerrainCreation(newTerrain.id, createdUserAuthors, strapi);
                        process.exit(1);
                    }
                }

                // add graines
                for(const [index, graine] of terrain.graines.entries()){
                    try{
                        await strapi.db.query("api::contribution.contribution").create({
                            data:{
                                text: graine.text,
                                terrain: newTerrain.id,
                                state: "Published",
                                perAuthorTextIndex: index + 1,
                                publicationDatetime: dayDateToDate(terrain.grainePublicationDatetime),
                            },
                            populate:["terrain"],
                        });
                    }catch(e){
                        console.error("error creating graine");
                        await cancelTerrainCreation(newTerrain.id, createdUserAuthors, strapi);
                        process.exit(1);
                    }
                }

                // produce report
                {
                  const reportFilepath = `./terrain_creation_reports/terrain_creation_report${terrain.title}.json`;
                  writeFileSync(reportFilepath, JSON.stringify(terrain, null, 2), {encoding:'utf-8'});
                  console.log("wrote report file", reportFilepath);
                }

                // produce password report
                {
                  const passwordReportFilepath = `./terrain_creation_reports/password_report_for_terrain.${terrain.title}.txt`;
                  let result = `passwords for terrain ${terrain.title}\n--------------------------------\n\n`;
                  for(const user of terrain.users){
                    result += `${user.user.email}:${user.user.password}\n`;
                  }
                  writeFileSync(passwordReportFilepath, result, {encoding:'utf-8'});
                  console.log("wrote password file", passwordReportFilepath);
                }

            }
        }
    },
};

