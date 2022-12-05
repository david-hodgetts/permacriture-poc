import axios, { AxiosError }  from 'axios';
import Config from "$lib/services/Config";
import type { Context, User } from "$lib/models/User";
import { getJwt } from "$lib/services/LocalStorage";
import { goto } from "$app/navigation";
import { Contribution } from "$lib/models/Contribution";


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
    throw e;
}

class StrapiService
{
    async getContext(optionaJwt: string = ""): Promise<Context|null>{
        const url = `${Config.baseUrl}/api/user-context`;
        console.log(axiosOptions(optionaJwt));
        try{
            let context = await axios.get(url, axiosOptions(optionaJwt));
            return context.data as Context;
        }catch(e){
            errorHandler(e as AxiosError);
            return null;
        }
    }

    async getContributions(): Promise<Contribution[]>{
        const url = `${Config.baseUrl}/api/contributions`;
        try{
            let response = await axios.get(url, axiosOptions());
            console.log(response);
            return response.data.entries.map(Contribution.newFromObj) as Contribution[];
        }catch(e){
            errorHandler(e as AxiosError);
            return [];
        }
    }

    async createNewContributionFromParent(contribution:Contribution): Promise<Contribution>{
        const url = `${Config.baseUrl}/api/contributions`;

    }
}

export const strapiService = new StrapiService();