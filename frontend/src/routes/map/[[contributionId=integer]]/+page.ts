import type { D3Graph } from '$lib/models/D3Graph';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Contribution } from '$lib/models/Contribution';
import type Author from '$lib/models/Author';


export const load: PageLoad = async ({ params }) => {
    let contribution: Contribution | null = null;
    console.log("reload");
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


    // get list of authors
    let authors: Author[] = [];
    try{
        authors = await strapiService.getAuthors();
    }catch(e){
        console.error(e);
        throw error(404, 'Not found');
    }

    console.log("authors", authors);


    try{
        const graph: D3Graph = await strapiService.getD3Graph();
        return {
            graph,  
            contribution,
            authors,
        };
    }catch(e){
        console.error(e);
        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}