import { newDateOrNull } from "$lib/services/dateUtils";
import { BaseStrapiEntity } from "./BaseStrapiEntity";
import type { id } from "./Id";

export enum ContributionState{
    Pending = "Pending",
    Published = "Published",
    Abandoned = "Abandoned",
};


export class Contribution extends BaseStrapiEntity{
    
    public author!: id;
    public text!: string;
    public state!: ContributionState;
    public publicationDatetime!: Date | null;
    public isSeed!: boolean;

    constructor(obj: any){
        super(obj);
        this.author = obj.author;
        this.text = obj.text;
        this.state = obj.ContributionState;
        this.publicationDatetime =  newDateOrNull(obj.publicationDatetime);
        this.isSeed = obj.isSeed;
    }
}