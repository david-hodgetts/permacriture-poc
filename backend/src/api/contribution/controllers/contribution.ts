/**
 * contribution controller
 */

import { factories } from '@strapi/strapi'
import { UserContext } from '../../user-context/services/user-context';


async function addChildrenAndParentsToContribution(contribution, strapi, userContext){
    const parentLinks = await strapi.service('api::link.link').parentsOfContribution(contribution.id, userContext);
    const childrenLinks = await strapi.service('api::link.link').childrenOfContribution(contribution.id, userContext);

    // contribution.children = childrenLinks.map(l => l.child.id);
    // contribution.parents = parentLinks.map(l => l.parent.id);
    let children = childrenLinks.map(l => l.child.id);
    let parents = parentLinks.map(l => l.parent.id);

    // only show links that point to published contributions
    {
        const promises = children.map(id => strapi.service('api::contribution.contribution').findOne(id));
        const childrenContributions = await Promise.all(promises);

        children = children.filter(id => {
            const contribution = childrenContributions.find((c) => c.id == id);
            return contribution.state == "Published";
        });

        contribution.children = children;
    }

    {
        const promises = parents.map(id => strapi.service('api::contribution.contribution').findOne(id));
        const parentContributions = await Promise.all(promises);

        parents = parents.filter(id => {
            const contribution = parentContributions.find((c) => c.id == id);
            return contribution.state == "Published";
        });

        contribution.children = children;
        contribution.parents = parents;
    }
}

async function computeNextPerAuthorTextIndexForUser(userContext) : Promise<number>{

    const contributions = await strapi.db.query('api::contribution.contribution').findMany({
        select: ['id'],
        where: {
            'author': userContext.author.id,
        },
    });

    return contributions.length + 1;
}


type Context = {
    terrain: any,
    userContext: UserContext | null
}

async function authorize(strapi, ctx): Promise<Context> {
    const terrainSlug = ctx.request.params.id;
    const terrain = await strapi.service("api::terrain.terrain").getTerrainForSlug(terrainSlug);
    if (!terrain) {
        ctx.notFound();
        throw new Error();
    }

    if(terrain.public){
        return{
            terrain,
            userContext: null,
        }
    }

    // handle cases where terrain is not public

    if (!ctx.state.user) {
        ctx.unauthorized();
        throw new Error();
    }

    const userContext = await getUserContext(strapi, ctx);

    if(userContext.author.terrain.id != terrain.id){
        ctx.unauthorized();
        throw new Error();
    }

    return {
        terrain,
        userContext,
    }
}

async function getUserContext(strapi, ctx){

    const userId = ctx.state.user.id;
    let userContext;
    try{
        userContext = await strapi.service('api::user-context.user-context').getContext(userId);
    }catch (e){
        ctx.badRequest("invalid user context", {});
        throw new Error();
    }

    return userContext;
}

export default factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({

    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
        let context;
        try{
            context = await authorize(strapi, ctx);
        }catch(e){
            return ctx;
        }

        console.log("context", context);

        const userId = ctx.state.user.id;
        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);


        const contributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: ['id', 'text', 'state', 'publicationDatetime', 'createdAt', 'perAuthorTextIndex'],
            where:{
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
        for(let contribution of contributions){
            await addChildrenAndParentsToContribution(contribution, strapi, userContext);
        }

        // console.log("contributions", contributions);

        ctx.body = {
            data: contributions
        };
    },

    // Method 3: Replacing a core action
    async findOne(ctx) {
        const userId = ctx.state.user.id;
        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);
        const { id } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::contribution.contribution').findOne(id, query);
        if(!entity){
            return ctx.notFound("contribution not found", {});
        }

        await addChildrenAndParentsToContribution(entity, strapi, userContext);

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
            select: ['id', 'text', 'publicationDatetime', 'state', 'createdAt', 'perAuthorTextIndex'],
            where: {
                'author': userContext.author.id,
            },
            populate: ['author'],
        });
        // console.log(contributions);
        // add direct ancestors and children
        for(const contribution of contributions){
            await addChildrenAndParentsToContribution(contribution, strapi, userContext);
        }

        ctx.body = {
            data: contributions
        };
    },


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

        const nextPerAuthorTextIndex = await computeNextPerAuthorTextIndexForUser(userContext);

        // 1. create new contribution
        const newContribution = await strapi.entityService.create('api::contribution.contribution', {
            data: {
                author: userContext.author.id,
                state: "Editing",
                text: "",
                terrain: userContext.author.terrain.id,
                perAuthorTextIndex: nextPerAuthorTextIndex,
            },
            populate: ['author'],
        });

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
    },

    // async cancelPublication(ctx){

    //     // contribution id from query params
    //     const { id } = ctx.params;
    //     console.log("cancel publication for contribution id", id);

    //     await strapi.entityService.update("api::contribution.contribution", id,
    //     {
    //         data: {
    //             'state': 'Editing',
    //             'publicationDatetime': null,
    //         },
    //     });

    //     ctx.body = {
    //         data: { id: id },
    //     };
    // },

    async abandon(ctx){

        // contribution id from query params
        const { id } = ctx.params;
        console.log("abandon publication for contribution id", id);

        await strapi.entityService.update("api::contribution.contribution", id,
        {
            data: {
                'state': 'Abandoned',
                'publicationDatetime': null,
            },
        });

        ctx.body = {
            data: { id: id },
        };
    },

    /**
     * adds secondary link to contribution
     * this adds the requested contribution (body.data.parentContributionId)
     * as a parent of the contribution
     * @param ctx
     * @returns
     */
    async addParent(ctx){
        // contribution id from query params
        const { id } = ctx.params;
        // extract parentContributionId from request body
        const parentContributionId = ctx.request.body.data.parentContributionId;
        console.log("parentContributionId", parentContributionId);

        // check that both ids are different
        if (id == parentContributionId){
            return ctx.badRequest("invalid parameters", {});
        }

        const userId = ctx.state.user.id;

        let userContext;
        try{
            userContext = await strapi.service('api::user-context.user-context').getContext(userId);
        }catch (e){
            return ctx.badRequest("invalid user context", {});
        }
        console.log("usercontext", userContext);

        // check parentContribution exists and is a valid contrib (ie is in published state)
        const parentContribution = await strapi.db.query('api::contribution.contribution').findOne({
            select: ['id'],
            where: {
                'id': parentContributionId,
                'state': 'Published',
            },
        });

        if(!parentContribution){
            return ctx.badRequest('invalid parent contribution', { });
        }

        // check we don't already have a link between contrib and new parent
        const maybeAlreadyExistingLink = await strapi.db.query('api::link.link').findOne({
            select: ['id'],
            where: {
                'parent': parentContributionId,
                'child': id,
            },
        });

        if (maybeAlreadyExistingLink){
            return ctx.badRequest('link betwen contribution and parent already exists', { });
        }

        // validations are ok
        // add the new secondary link
        const newLink = await strapi.entityService.create('api::link.link', {
            data: {
                parent: parentContributionId,
                child: id,
            },
        });

        ctx.body = {
            data: { id: newLink.id },
        };
    }
}));
