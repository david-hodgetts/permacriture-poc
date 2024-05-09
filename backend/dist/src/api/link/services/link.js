"use strict";
/**
 * link service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreService('api::link.link', ({ strapi }) => ({
    /**
     * @param {number} contributionId
     * @param {UserContext|null} userContext // if null, assume terrain is public
     * @returns a collection of parent links
     */
    async parentsOfContribution(contributionId, userContext = null) {
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
            if (userContext) {
                return p.state === "Published" || (p.author && p.author.id === authorId);
            }
            else {
                return p.state === "Published";
            }
        });
        return data;
    },
    /**
     * @param {number} contributionId
     * @param {UserContext|null} userContext // if null, assume terrain is public
     * @returns a collection of child links
     */
    async childrenOfContribution(contributionId, userContext = null) {
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
            if (userContext) {
                return c.state === "Published" || (c.author && c.author.id === authorId);
            }
            else {
                return c.state === "Published";
            }
        });
        return data;
    },
}));
