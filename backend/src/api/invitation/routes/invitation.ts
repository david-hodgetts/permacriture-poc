export default {
  routes: [
    {
     method: 'POST',
     path: '/invitation-request',
     handler: 'invitation.handleInvitationRequest',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
