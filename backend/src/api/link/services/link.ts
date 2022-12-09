/**
 * link service
 */

import { factories } from '@strapi/strapi';
import { GenericService } from '@strapi/strapi/lib/core-api/service';

// https://forum.strapi.io/t/strapi-custom-service-types/21977
export type LinkService = GenericService & {
    parentsOfContribution?(contributionId: number): void;
    childrenOfContribution?(contributionId: number): void;
};

// export default factories.createCoreService('api::link.link');
export default factories.createCoreService<LinkService>('api::link.link', ({ strapi }) =>  ({
    async parentsOfContribution(contributionId: number) {

        const data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'child': contributionId,
            },
            populate: ['parent', 'child'],
        });

        return data;
    },

    async childrenOfContribution(contributionId: number) {
        const data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'parent': contributionId,
            },
            populate: ['parent', 'child'],
        });
        
        return data;
    },
}) as LinkService);