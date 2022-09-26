export default {
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
