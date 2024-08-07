import axios from 'axios';
import Config from "$lib/services/Config";
import type { UserContext } from "$lib/models/User";
import { getJwt } from "$lib/services/LocalStorage";
import { goto } from "$app/navigation";
import { Contribution, ContributionState } from "$lib/models/Contribution";
import type { id } from '$lib/models/Id';
import type { Link } from '$lib/models/Link';
import type { D3Graph } from '$lib/models/D3Graph';
import type Author from '$lib/models/Author';
import type { TerrainStatus } from '$lib/models/Terrain';
import type { AppContext } from '$lib/models/App';

function axiosOptions(optionaJwt = "") {
    const authToken = optionaJwt ? optionaJwt : getJwt();
    if(!authToken){
        return {};
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        }
    };
}

enum HttpCode{
    unauthorized = 401,
}

/**
 * error handler, redirect user to login if unauthorized
 * @param e: AxiosError
 */
function errorHandler(e:any){
    console.error(e);
    if(isUnAuthorizedError(e)){
        goto("/login");
    }
}

export function isUnAuthorizedError(e:any): boolean{
    return axios.isAxiosError(e) && e.response?.status === HttpCode.unauthorized
}

class StrapiService
{
    async getLoggedInContext(optionaJwt = ""): Promise<UserContext>{
        const url = `${Config.baseUrl}/api/user-context`;
        // console.log(axiosOptions(optionaJwt));
        try{
            const response = await axios.get(url, axiosOptions(optionaJwt));
            const userContext = response.data;
            userContext.terrain = userContext.author.terrain;
            delete userContext.author.terrain;
            return userContext as UserContext;
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }

    async getAppContext(terrainSlug: string): Promise<AppContext>{
        const url = `${Config.baseUrl}/api/terrain/${terrainSlug}/context`;
        try{
            const response = await axios.get(url, axiosOptions());
            const appContext = response.data.data;
            return appContext as AppContext;
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }

    async contributionsForTerrainWithSlug(terrainSlug: string): Promise<Contribution[]>{
        console.log("getting contributions for terrain slug", terrainSlug, axiosOptions());
        const url = `${Config.baseUrl}/api/terrain/${terrainSlug}/contributions`;
        try{
            const response = await axios.get(url, axiosOptions());
            const contributions = response.data.data.map((item: any) => new Contribution(item)) as Contribution[];

            return contributions;
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }
    
    async contributionForTerrainWithId(terrainSlug: string, contributionId: id): Promise<Contribution>{
        const url = `${Config.baseUrl}/api/terrain/${terrainSlug}/contributions/${contributionId}?populate[0]=author`;
        try{
            const response = await axios.get(url, axiosOptions());
            return new Contribution(response.data);
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }

    async getLinksForTerrainSlug(terrainSlug:string): Promise<Link[]>{
        const url = `${Config.baseUrl}/api/terrain/${terrainSlug}/links`;
        try{
            const response = await axios.get(url, axiosOptions());
            return response.data.map((l: any) => {
                return {
                    id: l.id,
                    parent: l.parent.id,
                    child: l.child.id,
                    isFirstLink: l.isFirstLink,
                };
            }) as Link[];
        }catch(e){
            errorHandler(e);
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
            errorHandler(e);
            return -1;
        }
    }
    
    async addParentToContribution(contribution:Contribution, parentId: id): Promise<id>{
        const url = `${Config.baseUrl}/api/contributions/add-parent/${contribution.id}`;
        
        try{
            const payload = { 
                data:{
                    parentContributionId: parentId
                }
            }
            const response = await axios.put(url, payload, axiosOptions());
            console.log("response", response);
            return response.data.data.id;
        }catch(e){
            errorHandler(e);
            return -1;
        }
    }
    

    async updateContribution(changedProps: any): Promise<null>{
        const url = `${Config.baseUrl}/api/contributions/${changedProps.id}`;
        const payload = {
            data: changedProps
        };
        delete payload.data.id;
        // console.log(payload);
        try{
            await axios.put(url, payload, axiosOptions());
            return null;
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }
    
    async publishContribution(contribution: Contribution): Promise<null>{
        const url = `${Config.baseUrl}/api/contributions/publish/${contribution.id}`;
        try{
            await axios.put(url, {}, axiosOptions());
            return null;
        }catch(e){
            errorHandler(e);
            throw e;
        }
    }
	
    async abandonContribution(contribution: Contribution):Promise<null> {
        const url = `${Config.baseUrl}/api/contributions/abandon/${contribution.id}`;
        try{
            await axios.put(url, {}, axiosOptions());
            return null;
        }catch(e){
            errorHandler(e);
            throw e;
        }
	}

    async isTerrainEditable(): Promise<TerrainStatus>{
        const ctx = await strapiService.getLoggedInContext();

        const start = ctx.terrain.start;
        const end = ctx.terrain.end;
        if(!start || !end){
            return {
                isEditable:false,
                message: "invalid context provided",
            };
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        const now = Date.now();
        const oneDay = 60 * 60 * 24 * 1000;
        const isActive = now >= startDate.getTime() && now <= (endDate.getTime() + oneDay) ; 

        if(isActive){
            return {
                isEditable: true,
                message: "",
            }
        }

        const dateToDateStr = (date:Date) => `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`

        let terrainInactiveMessage = "";
        if(!isActive && now < startDate.getTime()){
            terrainInactiveMessage = `Ce terrain sera actif à partir du ${dateToDateStr(startDate)}`;
        }
        if(!isActive && now > (endDate.getTime() + oneDay)){
            terrainInactiveMessage = `Ce terrain a été actif du ${dateToDateStr(startDate)} au ${dateToDateStr(endDate)}`;
        }

        return {
            isEditable:false,
            message: terrainInactiveMessage
        }
    }

    async getAuthorsForTerrain(terrainSlug:string): Promise<Author[]> {
        const url = `${Config.baseUrl}/api/terrain/${terrainSlug}/authors`;
        
        try{
            const response = await axios.get(url, axiosOptions());
            return response.data.data as Author[] ;
        }catch(e){
            errorHandler(e);
            throw e;
        }
        
    }

    async getD3Graph(terrainSlug:string): Promise<D3Graph> {
        const contributions = (await this.contributionsForTerrainWithSlug(terrainSlug)).filter(c => {
            return c.state == ContributionState.Published || c.state == ContributionState.Editing;
        });


        const links: Link[] = (await strapiService.getLinksForTerrainSlug(terrainSlug)).filter((l: Link) => {
            // ensure we only get link for contributions that are accessible to current user
            // TODO: this check should be done in the backend
            // console.log(l);
            return !!contributions.find(c => c.id == l.child) && !!contributions.find(c => c.id == l.parent);
        });

        const d3Links = links.map((l: Link) => {
            // *source* and *target* attributes must point to index in nodes array
            // they are in no way linked to a node id!! in D3
            const parent = contributions.find(c => c.id == l.parent) as Contribution;
            const parentIndex = contributions.indexOf(parent);
            
            const child = contributions.find(c => c.id == l.child) as Contribution;
            const childIndex = contributions.indexOf(child);
            return {
                id: l.id,
                source: parentIndex,
                target: childIndex,
                isFirstLink: l.isFirstLink,
                linksToContributionInEditingState: child.state == ContributionState.Editing,
            };
        });

        return {
            nodes: contributions,
            links: d3Links,
        };
    }
}

export const strapiService = new StrapiService();