import { newDateOrNull } from "$lib/services/dateUtils";
import { hashStr, stringToColor } from "$lib/services/textUtils";
import type Author from "./Author";
import { BaseStrapiEntity } from "./BaseStrapiEntity";
import type { id } from "./Id";
import { get } from 'svelte/store';
import UserStore from '$lib/stores/user.store';
import userStore from "$lib/stores/user.store";

import { marked } from "marked";

export enum ContributionState{
    Editing = "Editing",
    PendingPublication = "PendingPublication",
    Published = "Published",
    Abandoned = "Abandoned",
};

export function displayStringForState(state: ContributionState): string{
    switch(state){
        case ContributionState.Abandoned:
            return "Abandonné";
        case ContributionState.PendingPublication:
            return "En attente de publication";
        case ContributionState.Editing:
            return "En cours d'édition";
        case ContributionState.Published:
            return "Publié";
        default:
            throw new Error(`no display string found for state ${state}`);
    }
}

export enum Order {
    Ascending = "Asc",
    Descending = "Desc",
};

export enum Filter {
    all, mine,
};

export enum Relation{
    Parent,
    Child,
}

export class Contribution extends BaseStrapiEntity{
    
    public author!: Author | null;
    public text!: string;
    public textHtml!: string;
    public state!: ContributionState;
    public publicationDatetime!: Date | null;
    public perAuthorTextIndex!: number | null;
    public children!: id[];
    public parents!: id[];

    public totalCountOfParents:number = 0;
    public totalCountOfChildren:number = 0;

    constructor(obj: any){
        super(obj);
        // console.log("item", obj);
        
        this.author = obj.author;
        this.text = obj.text;
        this.textHtml = marked(obj.text);
        this.state = obj.state;
        this.publicationDatetime = newDateOrNull(obj.publicationDatetime);
        this.perAuthorTextIndex = obj.perAuthorTextIndex;
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

    get isGraine(): boolean{
        return this.author == null;
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

    /**
     * define a title property based on the author's nickname + perAuthorTextIndex
     */
    public get title(): string{
        if(!this.author){
            return "Graine";
        }

        const textIndex = this.perAuthorTextIndex ? ` ${this.perAuthorTextIndex}` : '';
        return `${this.author.nickname}${textIndex}`;
    }

    // define a color from hash of author's nickname
    get color(): string{
        return stringToColor(this.author?.nickname || "");
    }

    getDirectRelationsOfType(relation: Relation){
        switch(relation){
            case Relation.Child:
                return this.children;
            case Relation.Parent:
                return this.parents;
            default:
                throw new Error(`unsupported relation found -> ${relation}`);
        }
    }
}