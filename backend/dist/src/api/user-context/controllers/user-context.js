"use strict";
/**
 * A set of functions called "actions" for `user-context`
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getUserContext: async (ctx, next) => {
        try {
            // console.log("user", ctx.state.user);
            const userId = ctx.state.user.id;
            const entry = await strapi.db.query('api::terrain.terrain').findOne({
                select: ['id', 'title', 'description'],
                where: {
                    'users': {
                        'id': userId,
                    }
                },
                populate: ['users'],
            });
            const data = {
                terrain: {
                    id: entry.id,
                    title: entry.title,
                }
            };
            ctx.body = JSON.stringify(data);
        }
        catch (err) {
            ctx.body = err;
        }
    }
};
