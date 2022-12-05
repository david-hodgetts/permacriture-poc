/**
 * user-context service
 */

const { createCoreService } = require('@strapi/strapi').factories;

 module.exports = createCoreService('api::user-context.user-context', ({ strapi }) =>  ({
    // Method 1: Creating an entirely new custom service
  
    // Method 3: Replacing a core service
    
    async getContext(userId: number) {
         
        const entry = await strapi.db.query('api::terrain.terrain').findOne({
            select: ['id', 'title', 'description'],
            where: {
                'users': {
                    'id': userId,
                }
            }
        });

        const data = {
            terrain: {
                id: entry.id,
                title: entry.title,
            }
        }

        return data;
    }
}));