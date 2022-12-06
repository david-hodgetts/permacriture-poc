/**
 * user-context service
 */

const { createCoreService } = require('@strapi/strapi').factories;

 module.exports = createCoreService('api::user-context.user-context', ({ strapi }) =>  ({
    // Method 1: Creating an entirely new custom service
  
    // Method 3: Replacing a core service
    
    async getContext(userId: number) {

        const author = await strapi.query('api::author.author').findOne({
            select:['id', 'nickname'],
            where: {
                'user': {
                    'id': userId,
                }
            },
            populate: ['terrain']
        });

        const data = {
            userId,
            author,
        }

        return data;
    }
}));