import type { Terrain } from "$lib/models/Terrain";

import axios  from 'axios';
import Config from "$lib/services/Config";
import type { User } from "$lib/models/User";
import { getJwt } from "$lib/services/LocalStorage";


function axiosOptions(){

  const authToken = getJwt();
  return {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    }
  };
}

class StrapiService
{

    async getTerrain(user:User): Promise<Terrain|null>{
        const url = `${Config.baseUrl}/api/users/me`;
        console.log(axiosOptions());
        try{
            let terrain = await axios.get(url, axiosOptions());
            console.log(terrain);
            return terrain as any as Terrain;
        }catch(e){
          console.error(e);
          return null;
        }
    }
}

export const strapiService = new StrapiService();