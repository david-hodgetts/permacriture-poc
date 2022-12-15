/**
 * contribution only modifiable if in Pending state
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

    if(!contribution || contribution.state !== 'Pending'){
        return false;
    }

    return true;
};