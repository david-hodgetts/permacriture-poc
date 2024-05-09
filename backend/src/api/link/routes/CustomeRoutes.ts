
export default {
    routes: [
        {
            method: 'GET',
            path: '/terrain/:terrainId/links',
            handler: 'link.find',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/terrain/:terrainId/links/:linkId',
            handler: 'link.findOne',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
