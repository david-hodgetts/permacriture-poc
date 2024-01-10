import type { Contribution } from '$lib/models/Contribution';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    console.log(params);
    const contributionId = params.contributionId;
    console.log(contributionId);

    try{
        const contribution: Contribution = await strapiService.contributionWithId(parseInt(contributionId));
        return {
            contribution,
        };
    }catch(e){

        // FIX: improve error handling 
        error(404, 'Not found');
    }

}