import type User from "./User";

export enum ContributionState{
    Pending = "Pending",
    Published = "Published",
    Abandoned = "Abandoned",
};

function isValidDateObj(d:Date): boolean {
    return d instanceof Date && !isNaN(d as any);
}

function newDateOrNull(dateStr: string | null): Date | null{
    if(!dateStr){
        return null;
    }

    const result = new Date(dateStr);

    if(!isValidDateObj(result)){
        return null;
    }

    return null;
}

export class Contribution{
    
    constructor(
        public id: number,
        public author: User,
        public text: string,
        public state: ContributionState,
        public publicationDatetime: Date | null,
        public lastSavedDatetime: Date | null,
        public isSeed: boolean,
    ){}

    public static newFromObj(obj:any){
        return new Contribution(
            obj.id,
            obj.author, 
            obj.text, 
            obj.state,
            newDateOrNull(obj.publicationDatetime),
            newDateOrNull(obj.lastSavedDatetime),
            obj.isSeed,
        );
    }
}