"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/terrain/:terrainId/authors',
            handler: 'author.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
