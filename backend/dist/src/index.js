"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const bootstrapModel_1 = require("./bootstrapHandler/bootstrapModel");
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
    async bootstrap({ strapi }) {
        const terrains = JSON.parse((0, fs_1.readFileSync)("./bootstrapData.json", { encoding: 'utf-8' }));
        console.log("server start", terrains[0]);
        for (const terrain of terrains) {
            // 1. does the terrain exist
            const strapiTerrain = await strapi.db.query('api::terrain.terrain').findOne({
                select: ['title'],
                where: { title: terrain.title },
            });
            if (!strapiTerrain) {
                const newTerrain = await strapi.db.query('api::terrain.terrain').create({
                    data: {
                        title: terrain.title,
                        description: terrain.description,
                        start: (0, bootstrapModel_1.dayDateToDate)(terrain.start),
                        end: (0, bootstrapModel_1.dayDateToDate)(terrain.end),
                        contribution_publication_delay: terrain.contribution_publication_delay,
                    }
                });
                // add users
                for (const userAuthorPair of terrain.users) {
                    let newUser = await strapi.plugins['users-permissions'].services.user.add({
                        blocked: false,
                        confirmed: true,
                        username: userAuthorPair.user.username,
                        email: userAuthorPair.user.email,
                        password: userAuthorPair.user.email,
                        provider: 'local',
                        created_by: 1,
                        updated_by: 1,
                        role: 1 //role id
                    });
                    // create author
                    let newAuthor = await strapi.db.query('api::author.author').create({
                        data: {
                            nickname: userAuthorPair.author.nickname,
                            user: newUser.id,
                            terrain: newTerrain.id
                        },
                        populate: ['user', 'terrain'],
                    });
                    // admin::user is an admin user of the cms
                    // const newUser = await strapi.db.query('admin::user').create({
                    //     data:{
                    //         username: user.username,
                    //         email: user.email,
                    //         password: user.password, 
                    //     }
                    // });
                    console.log("create user from data", userAuthorPair);
                    console.log("new user", newUser);
                }
                console.log("new terrain", newTerrain);
            }
            console.log("strapi terrain -> ", strapiTerrain);
        }
    },
};
