import type { Terrain } from "$lib/models/Terrain";

import axios  from 'axios';
import Config from "$lib/services/Config";
import type { User } from "$lib/models/User";
import userStore from "/stores/user.store";


function axiosOptions(){

  const authToken = ;
  return {
    headers: { 
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    }
  };
}

class StrapiService
{

    async getTerrain(user:User): Promise<Terrain>{
        const url = `${Config.baseUrl}/Users/${user.id}`;

        try{
            let terrain = await axios.get(url, )
        }
    }
}

export const strapiService = new StrapiService();