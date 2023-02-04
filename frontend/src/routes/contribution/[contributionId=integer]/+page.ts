import type { Contribution } from '$lib/models/Contribution';
import type { id } from '$lib/models/Id';
import { strapiService } from '$lib/services/StrapiService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    console.log(params);
    const contributionId = parseInt(params.contributionId);
    console.log(contributionId);

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

        return {
            contribution,
            parentContributions,
            childContributions,
        };
    }catch(e){

        // FIX: improve error handling 
        throw error(404, 'Not found');
    }
}