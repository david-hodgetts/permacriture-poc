/**
 * contribution only modifiable if in Editing state
 */
export default async (policyContext, config, { strapi }) => {

    const ctx = strapi.requestContext.get();
    const { id } = ctx.params;
    const contribution = await strapi.db.query("api::contribution.contribution").findOne({
        select:['id', 'state'],
        where: {
            'id': id,
        },
    });

    if(!contribution || contribution.state !== 'Editing'){
        return false;
    }

    return true;
};