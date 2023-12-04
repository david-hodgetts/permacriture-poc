"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * reject if contribution is not in Editing state
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
    if (!contribution || contribution.state === 'Published' || contribution.state === 'Abandoned') {
        return false;
    }
    return true;
};
