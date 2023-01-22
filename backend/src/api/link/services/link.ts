/**
 * link service
 */

import { factories } from '@strapi/strapi';
import { GenericService } from '@strapi/strapi/lib/core-api/service';

// https://forum.strapi.io/t/strapi-custom-service-types/21977
export type LinkService = GenericService & {
    parentsOfContribution?(contributionId: number, userContext:any): void;
    childrenOfContribution?(contributionId: number, userContext:any): void;
};



// export default factories.createCoreService('api::link.link');
export default factories.createCoreService<LinkService>('api::link.link', ({ strapi }) =>  ({
    async parentsOfContribution(contributionId: number, userContext:any) {

        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'child': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });

        // we only want to return the links that point to contributions that are either mine or with state published
        const authorId = userContext.author.id;
        data = data.filter((elem: {
            id:number, 
            parent:{state: string, author:{id:number}|null}, 
            child:{state: string, author:{id:number}|null}
        }) => {
            const p = elem.parent;
            return p.state === "Published" || (p.author && p.author.id === authorId);
        });

        return data;
    },

    async childrenOfContribution(contributionId: number, userContext:any) {
        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'parent': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });

        // we only want to return the links that point to contributions that are either mine or with state published
        const authorId = userContext.author.id;
        data = data.filter((elem: {
            id:number, 
            parent:{state: string, author:{id:number}|null}, 
            child:{state: string, author:{id:number}|null}
        }) => {
            const c = elem.child;
            return c.state === "Published" || (c.author && c.author.id === authorId);
        });
        
        return data;
    },
}) as LinkService);