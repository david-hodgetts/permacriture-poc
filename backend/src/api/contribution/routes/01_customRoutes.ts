
export default {
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