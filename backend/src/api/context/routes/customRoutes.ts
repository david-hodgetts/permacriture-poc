
export default {
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
