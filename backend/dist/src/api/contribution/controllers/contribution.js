"use strict";
/**
 * contribution controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({
    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        // some custom logic here
        // ctx.query = { ...ctx.query, local: 'en' };
        // Calling the default core action
        // const { data, meta } = await super.find(ctx);
        // console.log("data", data);
        // console.log("meta", meta);
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
            select: ['id', 'text', 'isSeed', 'state', 'publicationDatetime',],
            where: {
                'terrain': {
                    'id': userContext.author.terrain.id,
                },
                'state': 'Published',
            },
            populate: ['author'],
            orderBy: { publicationDatetime: 'asc' }
        });
        console.log("contributions", contributions);
        // // some more custom logic
        // meta.date = Date.now();
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
            select: ['id', 'text', 'publicationDatetime', 'isSeed', 'state'],
            where: {
                'author': userContext.author.id,
                'state': 'Pending',
            },
            populate: ['author'],
        });
        console.log(contributions);
        ctx.body = {
            data: contributions
        };
    },
    // TODO: extract in service
    async create(ctx) {
        // some logic here
        // const response = await super.create(ctx);
        // some more logic
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
                state: "Pending",
                isSeed: false,
                text: "",
                terrain: userContext.author.terrain.id,
            },
            populate: ['author'],
        });
        // replace full leaky object by id
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
    }
}));
