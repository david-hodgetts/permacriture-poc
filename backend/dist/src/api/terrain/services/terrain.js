"use strict";
/**
 * terrain service
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import { factories } from '@strapi/strapi';
// export default factories.createCoreService('api::terrain.terrain');
const { createCoreService } = require('@strapi/strapi').factories;
exports.default = createCoreService('api::terrain.terrain', ({ strapi }) => ({
    // Method 1: Creating an entirely new custom service
    // Method 3: Replacing a core service
    async getTerrainForSlug(slug) {
        return strapi.db.query('api::terrain.terrain').findOne({
            where: { slug: slug },
        });
    }
}));
