"use strict";
/**
 * A set of functions called "actions" for `user-context`
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getUserContext: async (ctx, next) => {
        try {
            const userId = ctx.state.user.id;
            const userContext = await strapi.service('api::user-context.user-context').getContext(userId);
            ctx.body = userContext;
        }
        catch (err) {
            ctx.body = err;
        }
    }
};
