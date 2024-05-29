import { strapiService } from "$lib/services/StrapiService";
import type Terrain from "./Terrain";
import type { UserContext } from "./User";


export interface AppContext{
    terrain: Terrain,
    userContext: UserContext | null,
}


type TerrainSlug = string;

class AppContextManager{
    private appContextDict: Map<TerrainSlug, AppContext> = new Map<TerrainSlug, AppContext>();

    async contextForTerrainSlug(terrainSlug:string){
        if(this.appContextDict.has(terrainSlug)){
            return this.appContextDict.get(terrainSlug);
        }
        const appContext = await strapiService.getAppContext(terrainSlug);
        this.appContextDict.set(terrainSlug, appContext);
        return appContext;
    }
}

export const appContextManager = new AppContextManager();