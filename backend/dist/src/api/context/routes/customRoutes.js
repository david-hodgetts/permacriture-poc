"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/terrain/:terrainId/context',
            handler: 'context.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
