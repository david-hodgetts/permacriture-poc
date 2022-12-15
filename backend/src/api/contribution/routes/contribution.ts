/**
 * contribution router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contribution.contribution', 
{
    only: ['find', 'findOne', 'create', 'update', 'delete'],
    config: {
        update: {
            policies: ["is-contribution-mine", "is-contribution-updatable"],
        },
        findOne: {},
        create: {},
        delete: {},
    },
});
