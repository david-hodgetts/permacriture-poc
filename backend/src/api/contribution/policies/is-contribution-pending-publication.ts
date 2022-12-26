/**
 * contribution only modifiable if in Editing state
 */
export default async (policyContext, config, { strapi }) => {

    console.log("test policy--------------------------------");
    const ctx = strapi.requestContext.get();
    const { id } = ctx.params;
    const contribution = await strapi.db.query("api::contribution.contribution").findOne({
        select:['id', 'state'],
        where: {
            'id': id,
        },
    });

    console.log(contribution.state);

    if(!contribution || contribution.state !== 'PendingPublication'){
        return false;
    }

    return true;
};