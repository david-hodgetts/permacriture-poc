"use strict";
/**
 * contribution router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::contribution.contribution', {
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
