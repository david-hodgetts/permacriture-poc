"use strict";
/**
 * link service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreService('api::link.link', ({ strapi }) => ({
    async parentsOfContribution(contributionId, userContext) {
        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'child': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });
        // we only want to return the links that point to contributions that are either mine or with state published
        const authorId = userContext.author.id;
        data = data.filter((elem) => {
            const p = elem.parent;
            return p.state === "Published" || (p.author && p.author.id === authorId);
        });
        return data;
    },
    async childrenOfContribution(contributionId, userContext) {
        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'parent': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });
        // we only want to return the links that point to contributions that are either mine or with state published
        const authorId = userContext.author.id;
        data = data.filter((elem) => {
            const c = elem.child;
            return c.state === "Published" || (c.author && c.author.id === authorId);
        });
        return data;
    },
}));
