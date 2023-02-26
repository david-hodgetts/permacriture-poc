import type { D3Graph } from '$lib/models/D3Graph';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

    try{
        const graph: D3Graph = await strapiService.getD3Graph();
        return {
            graph,  
        } 
    }catch(e){
        console.error(e);
        // FIX: improve error handling 
        throw error(404, 'Not found');
    }

}