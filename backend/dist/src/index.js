"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const bootstrapModel_1 = require("./bootstrapHandler/bootstrapModel");
async function createUserAuthorPair(userAuthorPair, terrainId) {
    let newUser = null;
    try {
        newUser = await strapi.plugins['users-permissions'].services.user.add({
            blocked: false,
            confirmed: true,
            username: userAuthorPair.user.username,
            email: userAuthorPair.user.email,
            password: userAuthorPair.user.password,
            provider: 'local',
            created_by: 1,
            updated_by: 1,
            role: 1 //role id
        });
    }
    catch (e) {
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
    };
}
/**
 * delete terrain and authors, graines
 * @param terrainId
 * @param createdUserAuthors
 */
async function cancelTerrainCreation(terrainId, createdUserAuthors, strapi) {
    try {
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
        for (const contribution of contributions) {
            console.log("removing contribution with id", contribution.id);
            await strapi.db.query("api::contribution.contribution").delete({
                where: {
                    id: contribution.id,
                }
            });
        }
        // 2 remove user/author pairs
        for (const userAuthorPairIds of createdUserAuthors) {
            console.log("removing author with id", userAuthorPairIds.userId);
            await strapi.db.query("api::author.author").delete({
                where: {
                    id: userAuthorPairIds.authorId
                },
            });
            console.log("removing user with id", userAuthorPairIds.userId);
            await strapi.query('plugin::users-permissions.user').delete({
                where: {
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
    }
    catch (e) {
        console.error("error while cancelling terrain creation", e);
        console.error("aborting process");
        process.exit(1);
    }
    console.log(`successully removed terrain with id ${terrainId} and associated data`);
}
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register( /*{ strapi }*/) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi: Strapi }) {
        // prepare data
        let terrains;
        try {
            const terrainsJson = JSON.parse((0, fs_1.readFileSync)("./bootstrapData.json", { encoding: 'utf-8' }));
            terrains = terrainsJson.map(bootstrapModel_1.terrainJSONToTerrain);
        }
        catch (e) {
            console.error("failed to prepare date for terrain ingestion", e);
            process.exit(1);
        }
        console.log("-----------------------------");
        console.log("Starting bootstrap process");
        console.log("ingesting new terrains...");
        for (const terrain of terrains) {
            // 1. does the terrain exist
            const strapiTerrain = await strapi.db.query('api::terrain.terrain').findOne({
                select: ['title'],
                where: { title: terrain.title },
            });
            if (!strapiTerrain) {
                console.log("found new terrain with title ->", terrain.title);
                const newTerrain = await strapi.db.query('api::terrain.terrain').create({
                    data: {
                        title: terrain.title,
                        description: terrain.description,
                        start: (0, bootstrapModel_1.dayDateToDate)(terrain.start),
                        end: (0, bootstrapModel_1.dayDateToDate)(terrain.end),
                        contribution_min_publication_delay_minutes: terrain.contribution_min_publication_delay_minutes,
                        contribution_max_publication_delay_minutes: terrain.contribution_max_publication_delay_minutes,
                    }
                });
                // use this collection to collect all user/author pairs
                // useful if we must rollbak and delete newly created user/authors
                let createdUserAuthors = [];
                // add users
                for (const userAuthorPair of terrain.users) {
                    console.log("create user from data", userAuthorPair);
                    try {
                        const userAuthorIds = await createUserAuthorPair(userAuthorPair, newTerrain.id);
                        createdUserAuthors.push(userAuthorIds);
                    }
                    catch (e) {
                        console.error("error creating user author pair");
                        await cancelTerrainCreation(newTerrain.id, createdUserAuthors, strapi);
                    }
                }
                // add graines
                for (const [index, graine] of terrain.graines.entries()) {
                    try {
                        await strapi.db.query("api::contribution.contribution").create({
                            data: {
                                text: graine.text,
                                terrain: newTerrain.id,
                                state: "Published",
                                perAuthorTextIndex: index + 1,
                                publicationDatetime: (0, bootstrapModel_1.dayDateToDate)(terrain.grainePublicationDatetime),
                            },
                            populate: ["terrain"],
                        });
                    }
                    catch (e) {
                        console.error("error creating graine");
                        await cancelTerrainCreation(newTerrain.id, createdUserAuthors, strapi);
                    }
                }
                // produce report
                const reportFilepath = `./terrain_creation_reports/terrain_creation_report${terrain.title}.json`;
                (0, fs_1.writeFileSync)(reportFilepath, JSON.stringify(terrain, null, 2), { encoding: 'utf-8' });
                console.log("wrote report file", reportFilepath);
            }
        }
    },
};
