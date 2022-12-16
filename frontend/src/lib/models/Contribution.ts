import { newDateOrNull } from "$lib/services/dateUtils";
import { produceDateString } from "$lib/services/textUtils";
import type Author from "./Author";
import { BaseStrapiEntity } from "./BaseStrapiEntity";
import type { id } from "./Id";
import { get } from 'svelte/store';
import UserStore from '$lib/stores/user.store';
import type User from "./User";
import userStore from "$lib/stores/user.store";

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

    get isMine(): boolean{
        if(!this.author){
            return false;
        }

        const { user } = get(UserStore);

        return user?.context.author.id === this.author.id;
    }

}