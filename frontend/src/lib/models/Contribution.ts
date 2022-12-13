import { newDateOrNull } from "$lib/services/dateUtils";
import type Author from "./Author";
import { BaseStrapiEntity } from "./BaseStrapiEntity";
import type { id } from "./Id";

export enum ContributionState{
    Pending = "Pending",
    Published = "Published",
    Abandoned = "Abandoned",
};


export class Contribution extends BaseStrapiEntity{
    
    public author!: Author | null;
    public text!: string;
    public state!: ContributionState;
    public publicationDatetime!: Date | null;
    public children!: id[];
    public parents!: id[];

    constructor(obj: any){
        super(obj);
        this.author = obj.author;
        this.text = obj.text;
        this.state = obj.state;
        this.publicationDatetime =  newDateOrNull(obj.publicationDatetime);
        this.children = obj.children;
        this.parents = obj.parents;
    }
}