import type { Contribution } from '$lib/models/Contribution';
import type { id } from '$lib/models/Id';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type Author from '$lib/models/Author';
import type { D3Graph } from '$lib/models/D3Graph';


async function prepareMapData(){


    try{
        const authors = await strapiService.getAuthors();
        const graph: D3Graph = await strapiService.getD3Graph();
        return {
            graph,  
            contribution: null,
            authors,
        };
    }catch(e){
        console.error(e);
        // FIX: improve error handling 
        error(404, 'Not found');
    }
}
export const load: PageLoad = async ({ params }) => {
    // console.log(params);
    const contributionId = parseInt(params.contributionId);
    // console.log(contributionId);

    try{
        const contributions: Contribution[] = await strapiService.getContributions();
        const mapOfContributions:Map<id, Contribution> = new Map<id, Contribution>();
        for(const c of contributions){
            mapOfContributions.set(c.id, c);
        }
        
        if(!mapOfContributions.has(contributionId)){
            throw new Error(`invalid contribution id ${contributionId}`);
        }
        const contribution: Contribution = mapOfContributions.get(contributionId) as Contribution;
        const parentContributions = contribution.parents.map((id) => {
            return mapOfContributions.get(id);
        }) as Contribution[];
        
        const childContributions = contribution.children.map((id) => {
            return mapOfContributions.get(id);
        }) as Contribution[];

        console.log("counts", parentContributions, childContributions);

        const mapData = await prepareMapData();
        return {
            contribution,
            parentContributions,
            childContributions,
            mapData,
        };
    }catch(e){

        // FIX: improve error handling 
        error(404, 'Not found');
    }
}