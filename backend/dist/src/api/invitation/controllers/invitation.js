"use strict";
/**
 * A set of functions called "actions" for `invitation`
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    handleInvitationRequest: async (ctx, next) => {
        try {
            const email = ctx.request.body.email;
            console.log(email);
            ctx.body = 'ok';
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = err;
        }
    }
};
