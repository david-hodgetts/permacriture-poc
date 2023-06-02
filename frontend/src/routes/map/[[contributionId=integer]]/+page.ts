import type { D3Graph } from '$lib/models/D3Graph';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Contribution } from '$lib/models/Contribution';


export const load: PageLoad = async ({ params }) => {
    let contribution: Contribution | null = null;
    if(params.contributionId){
        const contributionId = parseInt(params.contributionId);
        if(!isNaN(contributionId)){
            try{
                contribution = await strapiService.contributionWithId(contributionId);
            }catch(e){
                console.error(e);
                throw error(404, 'Not found');
            }
        }
    }


    try{
        const graph: D3Graph = await strapiService.getD3Graph();
        return {
            graph,  
            contribution,
        };
    }catch(e){
        console.error(e);
        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}