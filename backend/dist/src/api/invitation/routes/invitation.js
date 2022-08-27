"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
