import type User from "./User";

export enum ContributionState{
    Pending = "Pending",
    Published = "Published",
    Abandoned = "Abandoned",
};

export class Contribution{
    
    constructor(
        public id: number,
        public author: User,
        public text: string,
        public state: ContributionState,
        public publicationDatetime: Date,
        public isSeed: boolean,
    ){}

    public static newFromObj(obj:any){
        return new Contribution(
            obj.id,
            obj.author, 
            obj.text, 
            obj.state,
            new Date(obj.publicationDatetime),
            obj.isSeed,
        );
    }
}