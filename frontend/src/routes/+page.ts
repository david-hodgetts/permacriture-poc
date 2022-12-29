import type { Contribution } from '$lib/models/Contribution';
import type { id } from '$lib/models/Id';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    try{
        const contributions: Contribution[] = await strapiService.getContributions();
        const mapOfContributions:Map<id, Contribution> = new Map<id, Contribution>();

        for(const c of contributions){
            mapOfContributions.set(c.id, c);
        }

        return {
            contributions,
            mapOfContributions,
        };
    }catch(e){

        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}