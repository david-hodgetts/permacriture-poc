/**
 * A set of functions called "actions" for `user-context`
 */

export default {
  getUserContext: async (ctx, next) => {
    console.log("user", ctx.state.user);
    const userId = ctx.state.user.id;

    const entry = await strapi.db.query('api::terrain.terrain').findOne({
      select: ['id', 'title', 'description'],
      where: {'users': {
        'id': userId,
      }},
      populate: ['users'],
    });

    console.log(entry);

    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
