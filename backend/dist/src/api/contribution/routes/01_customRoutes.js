"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/contributions/mine',
            handler: 'contribution.myContributions',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
