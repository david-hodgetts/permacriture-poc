"use strict";
/**
 * contribution controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
async function addChildrenAndParentsToContribution(contribution, strapi) {
    const parentLinks = await strapi.service('api::link.link').parentsOfContribution(contribution.id);
    const childrenLinks = await strapi.service('api::link.link').childrenOfContribution(contribution.id);
    contribution.children = childrenLinks.map(l => l.child.id);
    contribution.parents = parentLinks.map(l => l.parent.id);
}
exports.default = strapi_1.factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({
    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        const userId = ctx.state.user.id;
        let userContext;
        try {
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }
        catch (e) {
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);
        const contributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'state', 'publicationDatetime', 'createdAt'],
            where: {
                $or: [
                    {
                        'terrain': {
                            'id': userContext.author.terrain.id,
                        },
                        'state': 'Published',
                    },
                    {
                        'terrain': {
                            'id': userContext.author.terrain.id,
                        },
                        'author': userContext.author.id,
                    },
                ]
            },
            populate: ['author'],
            orderBy: { publicationDatetime: 'desc' }
        });
        // add direct ancestors and children
        for (let contribution of contributions) {
            await addChildrenAndParentsToContribution(contribution, strapi);
        }
        console.log("contributions", contributions);
        ctx.body = {
            data: contributions
        };
    },
    // Method 3: Replacing a core action
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.service('api::contribution.contribution').findOne(id, query);
        if (!entity) {
            return ctx.notFound("contribution not found", {});
        }
        await addChildrenAndParentsToContribution(entity, strapi);
        console.log(entity);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        ctx.body = sanitizedEntity;
        // return this.transformResponse(sanitizedEntity);
    },
    async myContributions(ctx) {
        const userId = ctx.state.user.id;
        let userContext;
        try {
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }
        catch (e) {
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);
        const contributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'publicationDatetime', 'state', 'createdAt'],
            where: {
                'author': userContext.author.id,
            },
            populate: ['author'],
        });
        console.log(contributions);
        // add direct ancestors and children
        for (const contribution of contributions) {
            await addChildrenAndParentsToContribution(contribution, strapi);
        }
        ctx.body = {
            data: contributions
        };
    },
    // TODO: extract in service
    async create(ctx) {
        const userId = ctx.state.user.id;
        let userContext;
        try {
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }
        catch (e) {
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);
        // extract parentContributionId from request body
        const parentContributionId = ctx.request.body.data.parentContributionId;
        console.log("parentContributionId", parentContributionId);
        // check parentContribution exists and is a valid contrib (ie is in published state)
        const parentContribution = await strapi.db.query('api::contribution.contribution').findOne({
            select: ['id'],
            where: {
                'id': parentContributionId,
                'state': 'Published',
            },
        });
        console.log(parentContribution);
        if (!parentContribution) {
            return ctx.badRequest('invalid parent contribution', {});
        }
        // 1. create new contribution
        const newContribution = await strapi.entityService.create('api::contribution.contribution', {
            data: {
                author: userContext.author.id,
                state: "Editing",
                text: "",
                terrain: userContext.author.terrain.id,
            },
            populate: ['author'],
        });
        console.log(newContribution);
        console.log("creating first link");
        // 2. create link 
        const link = await strapi.entityService.create('api::link.link', {
            data: {
                parent: parentContributionId,
                child: newContribution.id,
                isFirstLink: true,
            },
        });
        console.log("link", link);
        ctx.body = {
            data: { id: newContribution.id },
        };
    },
    async publish(ctx) {
        // contribution id from query params
        const { id } = ctx.params;
        console.log("publish for contribution id", id);
        await strapi.entityService.update("api::contribution.contribution", id, {
            data: {
                'state': 'PendingPublication',
                'publicationDatetime': new Date(),
            },
        });
        ctx.body = {
            data: { id: id },
        };
    },
    async cancelPublication(ctx) {
        // contribution id from query params
        const { id } = ctx.params;
        console.log("cancel publication for contribution id", id);
        await strapi.entityService.update("api::contribution.contribution", id, {
            data: {
                'state': 'Editing',
                'publicationDatetime': null,
            },
        });
        ctx.body = {
            data: { id: id },
        };
    },
    async abandon(ctx) {
        // contribution id from query params
        const { id } = ctx.params;
        console.log("abandon publication for contribution id", id);
        await strapi.entityService.update("api::contribution.contribution", id, {
            data: {
                'state': 'Abandoned',
                'publicationDatetime': null,
            },
        });
        ctx.body = {
            data: { id: id },
        };
    }
}));
