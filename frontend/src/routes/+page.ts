import type { Contribution } from '$lib/models/Contribution';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    try{
        const contributions: Contribution[] = await strapiService.getContributions();
        return {
            contributions,
        };
    }catch(e){

        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}