/**
 * author controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::author.author');

export default factories.createCoreController('api::author.author', ({ strapi }) => ({

    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        const userId = ctx.state.user.id;
        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);


        const authors = await strapi.db.query('api::author.author').findMany({
            select: ['id', 'nickname'],
            where:{
                    'terrain': {
                        'id': userContext.author.terrain.id,
                    },
                }
            },
        );
        
        
        console.log("authors", authors);

        ctx.body = {
            data: authors 
        };
    },
}));