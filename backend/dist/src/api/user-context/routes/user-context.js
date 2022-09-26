"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/user-context',
            handler: 'user-context.getUserContext',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
