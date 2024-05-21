import type { Contribution } from '$lib/models/Contribution';
import type { id } from '$lib/models/Id';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const terrainSlug = params.terrainSlug;
    try{
        const contributions: Contribution[] = await strapiService.contributionsForTerrainWithSlug(terrainSlug);

        return {
            contributions,
        };
    }catch(e){

        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}