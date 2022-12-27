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
    Editing = "Editing",
    PendingPublication = "PendingPublication",
    Published = "Published",
    Abandoned = "Abandoned",
};

export enum Order {
    Ascending = "Asc",
    Descending = "Desc",
};

export enum Filter {
    all, mine,
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
        this.publicationDatetime = newDateOrNull(obj.publicationDatetime);
        this.createdAt = new Date(obj.createdAt);
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

    get delayInMinutesBeforePublication(): number{
        if(this.state !== ContributionState.PendingPublication){
            return 0;
        }

        const delayInMinutes = userStore.getUser()!.context.terrain.contribution_publication_delay * 60;

        const now = new Date();
        const remainingMillis = (this.publicationDatetime!.getTime() + delayInMinutes * 60 * 1000) - now.getTime();
        return Math.round(remainingMillis / 1000 / 60);
    }
}