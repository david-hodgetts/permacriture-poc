
export default {
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
