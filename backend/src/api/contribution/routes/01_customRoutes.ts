
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
        {
            method: 'PUT',
            path: '/contributions/cancel-publication/:id',
            handler: 'contribution.cancelPublication',
            config: {
                policies: ["is-contribution-mine", "is-contribution-pending-publication"],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/contributions/abandon/:id',
            handler: 'contribution.abandon',
            config: {
                policies: ["is-contribution-mine", "is-contribution-updatable"],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/contributions/add-parent/:id',
            handler: 'contribution.addParent',
            config: {
                policies: ["is-contribution-mine", "is-contribution-updatable"],
                middlewares: [],
            },
        },
    ],
};