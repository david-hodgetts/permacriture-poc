/**
 * contribution controller
 */

import { factories } from '@strapi/strapi'
import userContext from '../../user-context/controllers/user-context';

export default factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({

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
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);


        const contributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'state', 'publicationDatetime',],
            where: {
                'terrain': {
                    'id': userContext.author.terrain.id,
                },
                'state': 'Published',
            },
            populate: ['author'],
            orderBy: { publicationDatetime: 'asc'}
        });
        
        console.log("contributions", contributions);

        // add direct ancestors and children
        for(const contribution of contributions){
            
            const parentLinks = await strapi.service('api::link.link').parentsOfContribution(contribution.id); 
            const childrenLinks = await strapi.service('api::link.link').childrenOfContribution(contribution.id); 

            contribution.children = childrenLinks.map(l => l.id);
            contribution.parents = parentLinks.map(l => l.id);
        }

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
        if(!entity){
            return ctx.notFound("contribution not found", {});
        }
        
        const parentLinks = await strapi.service('api::link.link').parentsOfContribution(entity.id);
        const childrenLinks = await strapi.service('api::link.link').childrenOfContribution(entity.id);

        entity.children = childrenLinks.map(l => l.id);
        entity.parents = parentLinks.map(l => l.id);

        console.log(entity);
        
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        ctx.body = sanitizedEntity;

        // return this.transformResponse(sanitizedEntity);
    },

    async myContributions(ctx) {
        const userId = ctx.state.user.id;

        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);
        
        const contributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'publicationDatetime', 'state'],
            where: {
                'author': userContext.author.id,
            },
            populate: ['author'],
        });
        console.log(contributions);
        // add direct ancestors and children
        for(const contribution of contributions){
            
            const parentLinks = await strapi.service('api::link.link').parentsOfContribution(contribution.id); 
            const childrenLinks = await strapi.service('api::link.link').childrenOfContribution(contribution.id); 

            contribution.children = childrenLinks.map(l => l.id);
            contribution.parents = parentLinks.map(l => l.id);
        }
        
        ctx.body = {
            data: contributions
        };
    },

    // async update(ctx){
    //     const userId = ctx.state.user.id;

    //     let userContext;
    //     try{
    //         userContext = await strapi.service('api::user-context.user-context').getContext(userId);
    //     }catch (e){
    //         return ctx.badRequest("invalid user context", {});
    //     }
    //     console.log("update");
    //     console.log("usercontext", userContext);
        
    //     const { id } = ctx.params;
    //     console.log("contribution id", id);
    //     const contribution = await strapi.db.query("api::contribution.contribution").findOne(
    //         {
    //             select:['id', 'state'],
    //             where: {
    //                 'id': id,
    //                 'author': userContext.author.id,
    //             },
    //             populate:['author'],
    //         }
    //     );
    //     console.log("contribution", contribution);
    //     if(!contribution || contribution.state != "Pending"){
    //         return ctx.badRequest("invalid operation", {});
    //     }

    //     const response = await super.update(ctx);

    //     return response;
    // },

    // TODO: extract in service
    async create(ctx) {
        const userId = ctx.state.user.id;

        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
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
        if(!parentContribution){
            return ctx.badRequest('invalid parent contribution', { });
        }

        // 1. create new contribution
        const newContribution = await strapi.entityService.create('api::contribution.contribution', {
            data: {
                author: userContext.author.id,
                state: "Pending",
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
            data:{
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

    async publish(ctx){

        // contribution id from query params
        const { id } = ctx.params;
        console.log("publish for contribution id", id);

        await strapi.entityService.update("api::contribution.contribution", id,
        {
            data: {
                'state': 'Published',
                'publicationDatetime': new Date(),
            },
        });

        ctx.body = {
            data: { id: id },
        };
    }
})); 