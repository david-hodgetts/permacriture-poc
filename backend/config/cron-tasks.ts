import { writeFileSync } from 'fs';
export default {
    /**
     * Every 1 minutes
     */
  
    '* * * * *': async ({ strapi }) => {
        // For each contribution, check if it should change state

        const pendingContributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: [ 'state', 'publicationDatetime'],
            where:{
                'state': 'PendingPublication',
            },
            populate: ['terrain'],
        });

        // console.log("pending contributions ", pendingContributions);

        for(const contribution of pendingContributions){
            const delayMinutes = contribution.terrain.contribution_publication_delay * 60;
            const now = new Date();

            const elapsedMinutes = (now.getTime() - new Date(contribution.publicationDatetime).getTime()) / 1000 / 60;
            // console.log(`delay minutes ${delayMinutes} elapsed ${elapsedMinutes}`);

            if(elapsedMinutes > delayMinutes){
                await strapi.db.query('api::contribution.contribution').update({
                    where:{
                        id: contribution.id
                    },
                    data:{
                        state: "Published",
                        publicationDateTime: new Date(),
                    }
                });
            }
        }
    },
  };