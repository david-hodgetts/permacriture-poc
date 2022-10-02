import type { Terrain } from "$lib/models/Terrain";

import axios  from 'axios';
import Config from "$lib/services/Config";
import type { Context, User } from "$lib/models/User";
import { getJwt } from "$lib/services/LocalStorage";


function axiosOptions(optionaJwt:string = ""){

  const authToken = optionaJwt ? optionaJwt : getJwt();
  return {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    }
  };
}

class StrapiService
{

    async getContext(optionaJwt: string = ""): Promise<Context|null>{
        const url = `${Config.baseUrl}/api/user-context`;
        console.log(axiosOptions(optionaJwt));
        try{
            let context = await axios.get(url, axiosOptions(optionaJwt));
            console.log(context);
            return context.data as Context;
        }catch(e){
          console.error(e);
          return null;
        }
    }
}

export const strapiService = new StrapiService();