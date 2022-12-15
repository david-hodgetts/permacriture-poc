
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
        {
            method: 'PUT',
            path: '/contributions/publish/:id',
            handler: 'contribution.publish',
            config: {
                policies: ["is-contribution-mine", "is-contribution-updatable"],
                middlewares: [],
            },
        },
    ],
};