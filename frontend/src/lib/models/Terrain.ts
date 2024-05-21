export default interface Terrain
{
    id: number,
    title: string,
    description: string,
    contribution_min_publication_delay_minutes: number,
    contribution_max_publication_delay_minutes: number,
    slug: string,
}

export interface TerrainStatus{
    isEditable:boolean,
    message:string,
}