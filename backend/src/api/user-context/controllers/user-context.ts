/**
 * A set of functions called "actions" for `user-context`
 */

export default {
    getUserContext: async (ctx, next) => {
        try {
            // console.log("user", ctx.state.user);
            const userId = ctx.state.user.id;

            // const entry = await strapi.db.query('api::terrain.terrain').findOne({
            //     select: ['id', 'title', 'description'],
            //     where: {
            //         'users': {
            //             'id': userId,
            //         }
            //     },
            //     populate: ['users'],
            // });

            // const data = {
            //     terrain: {
            //         id: entry.id,
            //         title: entry.title,
            //     }
            // }

            const userContext = await strapi.service('api::user-context.user-context').getContext(userId);

            // ctx.body = JSON.stringify(userContext);
            ctx.body = userContext;
        } catch (err) {
            ctx.body = err;
        }
    }
};
