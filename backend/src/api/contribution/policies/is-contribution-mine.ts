/**
 * checks that contribution is Mine
 */
export default async (policyContext, config, { strapi }) => {
    const userId = policyContext.state.user.id;
    console.log("youpi---------------", userId);
    let userContext;
    try{
        userContext = await strapi.service('api::user-context.user-context').getContext(userId);
    }catch (e){
        console.error("unable to extract user context for user id", userId);
        return false;
    }

    const ctx = strapi.requestContext.get();
    const { id } = ctx.params;
    const contribution = await strapi.db.query("api::contribution.contribution").findOne({
        select:['id', 'state'],
        where: {
            'id': id,
            'author': userContext.author.id,
        },
    });

    if(!contribution){
        return false;
    }
    return true;
};