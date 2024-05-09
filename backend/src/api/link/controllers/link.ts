/**
 * link controller
 */

import { factories } from '@strapi/strapi'
import { authorize } from '../../../lib/authHelper';

// export default factories.createCoreController('api::link.link');

export default factories.createCoreController('api::link.link', ({ strapi }) => ({
    async find(ctx) {
        let terrainContext;
        try{
            terrainContext = await authorize(strapi, ctx);
        }catch(e){
            return ctx;
        }

        let links = await strapi.db.query('api::link.link').findMany({
            select: ['id', 'isFirstLink'],
            where:{
                $or: [
                    {
                        'parent': {
                            'terrain': {id: terrainContext.terrain.id},
                        },
                    },
                    {
                        'child': {
                            'terrain': {id: terrainContext.terrain.id},
                        },
                    },
                ]
            },
            populate: ['parent', 'child'],
        });

        const sanitizedLinks = await this.sanitizeOutput(links, ctx);
        ctx.body = sanitizedLinks;
    },
    async findOne(ctx) {
        let terrainContext;
        try{
            terrainContext = await authorize(strapi, ctx);
        }catch(e){
            return ctx;
        }
        let userContext = terrainContext.userContext;;
        const { linkId } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::link.link').findOne(linkId, query);
        if(!entity){
            return ctx.notFound("contribution not found", {});
        }


        console.log(entity);

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        ctx.body = sanitizedEntity;

        // return this.transformResponse(sanitizedEntity);
    },
}));
