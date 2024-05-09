"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
async function authorize(strapi, ctx) {
    const terrainSlug = ctx.request.params.terrainId;
    const terrain = await strapi.service("api::terrain.terrain").getTerrainForSlug(terrainSlug);
    if (!terrain) {
        ctx.notFound();
        throw new Error();
    }
    if (terrain.public) {
        return {
            terrain,
            userContext: null,
        };
    }
    // handle cases where terrain is not public
    if (!ctx.state.user) {
        ctx.unauthorized();
        throw new Error();
    }
    const userContext = await getUserContext(strapi, ctx);
    if (userContext.author.terrain.id != terrain.id) {
        ctx.unauthorized();
        throw new Error();
    }
    return {
        terrain,
        userContext,
    };
}
exports.authorize = authorize;
async function getUserContext(strapi, ctx) {
    const userId = ctx.state.user.id;
    let userContext;
    try {
        userContext = await strapi.service('api::user-context.user-context').getContext(userId);
    }
    catch (e) {
        ctx.badRequest("invalid user context", {});
        throw new Error();
    }
    return userContext;
}
