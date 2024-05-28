"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const authHelper_1 = require("../../../lib/authHelper");
exports.default = strapi_1.factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({
    async find(ctx) {
        let terrainContext;
        try {
            terrainContext = await (0, authHelper_1.authorize)(strapi, ctx);
        }
        catch (e) {
            return ctx;
        }
        ctx.body = {
            data: terrainContext
        };
    },
}));
