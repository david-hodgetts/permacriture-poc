import { newDateOrNull } from "$lib/services/dateUtils";
import { hashStr, stringToColor } from "$lib/services/textUtils";
import type Author from "./Author";
import { BaseStrapiEntity } from "./BaseStrapiEntity";
import type { id } from "./Id";
import { get } from 'svelte/store';
import UserStore from '$lib/stores/user.store';

import { marked } from "marked";
import { colorForAuthor } from "./Author";


// remove warnings
marked.setOptions({
    mangle: false,
    headerIds: false,
});

export enum ContributionState{
    Editing = "Editing",
    Published = "Published",
    Abandoned = "Abandoned",
};

export enum Order {
    Ascending = "Asc",
    Descending = "Desc",
};

export enum Filter {
    all = "tous", mine = "mes-textes",
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

    public totalCountOfParents = 0;
    public totalCountOfChildren = 0;

    constructor(obj: any){
        super(obj);
        // console.log("item", obj);
        // console.log("item", JSON.stringify(obj, null, 2));
        
        this.author = obj.author;
        this.text = obj.text;
        this.textHtml = marked(obj.text);
        this.state = obj.state;
        this.publicationDatetime = newDateOrNull(obj.publicationDatetime);
        this.perAuthorTextIndex = obj.perAuthorTextIndex;
        this.createdAt = new Date(obj.createdAt);
        this.children = obj.children;
        this.parents = obj.parents;

        this.whenPublishedEnsurePublicationDateIsPresent();
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

    get isPublishable(): boolean{
        if(this.state !== ContributionState.Editing){
            return false;
        }
        const now = new Date();
        const minDelayBeforePublication = UserStore.getUser()!.context.terrain.contribution_min_publication_delay_minutes;
        const elapsedMillisSinceCreation = (now.getTime() - this.createdAt.getTime());
        return elapsedMillisSinceCreation >= minDelayBeforePublication * 60 * 1000;
    }

    get isAbandonned(): boolean{
        return this.state == ContributionState.Abandoned;
    }

    get remainingTimeBeforePublication(): string{
        if(this.state !== ContributionState.Editing){
            return "";
        }
        const remainingMinutes = this.delayInMinutesBeforePublication; 
        // console.log("remaining minutes", remainingMinutes);

        const minutes = remainingMinutes % 60;
        const hours = (remainingMinutes - minutes) / 60;

        const hoursStr = hours > 0 ? `${hours.toString()} heures ` : "";
        const minutesStr = minutes > 0 ? `${minutes.toString()} minutes` : "";

        return `${hoursStr}${minutesStr}`;
    }

    get delayInMinutesBeforePubliForcable(): number{

        if(this.state !== ContributionState.Editing){
            return 0;
        }

        const delayInMinutes = UserStore.getUser()!.context.terrain.contribution_min_publication_delay_minutes;

        const now = new Date();
        const remainingMillis = (this.createdAt.getTime() + delayInMinutes * 60 * 1000) - now.getTime();
        // check for negative values (should not happen)
        if(remainingMillis < 0){
            return 0;
        }
        return Math.round(remainingMillis / 1000 / 60);
    }

    get delayInMinutesBeforePublication(): number{
        if(this.state !== ContributionState.Editing){
            return 0;
        }

        const delayInMinutes = UserStore.getUser()!.context.terrain.contribution_max_publication_delay_minutes;

        const now = new Date();
        const remainingMillis = (this.createdAt.getTime() + delayInMinutes * 60 * 1000) - now.getTime();
        // check for negative values (should not happen)
        if(remainingMillis < 0){
            return 0;
        }
        return Math.round(remainingMillis / 1000 / 60);
    }

    /**
     * generates text for contributor badge, based on first letter of nickname + perAuthorTextIndex
     */
    public get badgeText(): string{
        if(this.isGraine){
            return `&${this.perAuthorTextIndex}`;
        }

        const textIndex = this.perAuthorTextIndex ? ` ${this.perAuthorTextIndex}` : '';
        return `${this.author!.nickname[0]}${textIndex}`;
    }

    public get nickname():string{
        if(this.isGraine){
            return "";
        }

        return this.author!.nickname;
    }

    /**
     * define a title property based on the author's nickname + perAuthorTextIndex
     */
    public get title(): string{
        if(this.isGraine){
            return "Terreau";
        }

        const textIndex = this.perAuthorTextIndex ? ` ${this.perAuthorTextIndex}` : '';
        return `${this.author!.nickname}${textIndex}`;
    }

    // background color
    get color(): string{
        if(this.isGraine){
            return "#525EF5";
        }

        return colorForAuthor(this.author!);
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

    whenPublishedEnsurePublicationDateIsPresent(){
        if(this.state === ContributionState.Published && !this.publicationDatetime){
            const publicationDelayMinutes = UserStore.getUser()?.context.terrain.contribution_max_publication_delay_minutes;
            if(publicationDelayMinutes){
                const minutesToMillis = 60000;
                this.publicationDatetime = new Date(this.createdAt.getTime() + publicationDelayMinutes * minutesToMillis);
            }
        }
    }
}