import { writeFileSync } from 'fs';
export default {
    /**
     * Every 1 minutes
     */
  
    '* * * * *': async ({ strapi }) => {
        // For each contribution, check if it should change state
        const pendingContributions = await strapi.db.query('api::contribution.contribution').findMany({
            select: [ 'state', 'createdAt'],
            where:{
                'state': 'Editing',
            },
            populate: ['terrain'],
        });

        console.log("pending contributions ", pendingContributions);

        for(const contribution of pendingContributions){
            const maxDelayInMinutesBeforePublication = contribution.terrain.contribution_max_publication_delay_minutes;
            const now = new Date();

            const elapsedMinutes = (now.getTime() - new Date(contribution.createdAt).getTime()) / 1000 / 60;

            // console.log(`elapsed min ${elapsedMinutes} maxDelayBeforePubInMinutes ${maxDelayInMinutesBeforePublication}`);

            if(elapsedMinutes > maxDelayInMinutesBeforePublication){
                const publicationDate = new Date();
                await strapi.db.query('api::contribution.contribution').update({
                    where:{
                        id: contribution.id
                    },
                    data:{
                        state: "Published",
                        publicationDateTime: publicationDate,
                    }
                });
            }
        }
    },
  };