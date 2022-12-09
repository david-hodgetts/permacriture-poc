"use strict";
/**
 * link service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// export default factories.createCoreService('api::link.link');
exports.default = strapi_1.factories.createCoreService('api::link.link', ({ strapi }) => ({
    async parentsOfContribution(contributionId) {
        const data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'child': contributionId,
            },
            populate: ['parent', 'child'],
        });
        return data;
    },
    async childrenOfContribution(contributionId) {
        const data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'parent': contributionId,
            },
            populate: ['parent', 'child'],
        });
        return data;
    },
}));
