import axios, { AxiosError }  from 'axios';
import Config from "$lib/services/Config";
import type { Context, User } from "$lib/models/User";
import { getJwt } from "$lib/services/LocalStorage";
import { goto } from "$app/navigation";
import { Contribution } from "$lib/models/Contribution";
import type { id } from '$lib/models/Id';


function axiosOptions(optionaJwt: string = "") {
    const authToken = optionaJwt ? optionaJwt : getJwt();
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        }
    };
}

/**
 * error handler, redirect user to login if unauthorized
 * @param e: AxiosError
 */
function errorHandler(e: AxiosError){
    console.error(e);
    if(e.response?.status === 401){
        goto("/login");
    }
}

class StrapiService
{
    async getContext(optionaJwt: string = ""): Promise<Context>{
        const url = `${Config.baseUrl}/api/user-context`;
        console.log(axiosOptions(optionaJwt));
        try{
            const response = await axios.get(url, axiosOptions(optionaJwt));
            const context = response.data;
            context.terrain = context.author.terrain;
            delete context.author.terrain;
            return context as Context;
        }catch(e){
            errorHandler(e as AxiosError);
            throw e;
        }
    }

    async getContributions(): Promise<Contribution[]>{
        const url = `${Config.baseUrl}/api/contributions`;
        try{
            const response = await axios.get(url, axiosOptions());
            // console.log(response);
            return response.data.entries.map((entry:any) => new Contribution(entry)) as Contribution[];
        }catch(e){
            errorHandler(e as AxiosError);
            throw e;
        }
    }

    async createNewContributionFromParent(parentContribution:Contribution): Promise<id>{
        const url = `${Config.baseUrl}/api/contributions`;
        
        try{
            const payload = { 
                data:{
                    parentContributionId: parentContribution.id
                }
            }
            const response = await axios.post(url, payload, axiosOptions());
            return response.data.data.id;
        }catch(e){
            errorHandler(e as AxiosError);
            return -1;
        }
    }
    
    async contributionWithId(contributionId: id): Promise<Contribution>{
        const url = `${Config.baseUrl}/api/contributions/${contributionId}?populate[0]=author`;
        try{
            const response = await axios.get(url, axiosOptions());
            console.log(response.data);
            return new Contribution(response.data);
        }catch(e){
            errorHandler(e as AxiosError);
            throw e;
        }
    }
}

export const strapiService = new StrapiService();