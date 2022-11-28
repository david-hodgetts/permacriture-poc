/**
 * contribution controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({

    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        // some custom logic here
        // ctx.query = { ...ctx.query, local: 'en' };

        // Calling the default core action
        // const { data, meta } = await super.find(ctx);

        // console.log("data", data);
        // console.log("meta", meta);
        const userId = ctx.state.user.id;

        // get terrain of user
        const terrain = await strapi.db.query('api::terrain.terrain').findOne({
            select: ['id', 'title', 'description'],
            where: {
                'users': {
                    'id': userId,
                }
            },
        });

        console.log("terrain", terrain);

        const entries = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'isSeed', 'state', 'publicationDatetime'],
            where: {
                'terrain': {
                    'id': terrain.id,
                },
                'state': 'Published',
            },
            populate: ['author'],
            orderBy: { publicationDatetime: 'asc'}
        });
        
        console.log("entries", entries);




        // // some more custom logic
        // meta.date = Date.now();

        return { entries };
    },

    // Method 3: Replacing a core action
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::contribution.contribution').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },
})); 