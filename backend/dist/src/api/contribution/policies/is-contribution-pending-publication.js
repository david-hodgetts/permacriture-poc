"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * contribution only modifiable if in Editing state
 */
exports.default = async (policyContext, config, { strapi }) => {
    const ctx = strapi.requestContext.get();
    const { id } = ctx.params;
    const contribution = await strapi.db.query("api::contribution.contribution").findOne({
        select: ['id', 'state'],
        where: {
            'id': id,
        },
    });
    console.log(contribution.state);
    if (!contribution || contribution.state !== 'PendingPublication') {
        return false;
    }
    return true;
};
