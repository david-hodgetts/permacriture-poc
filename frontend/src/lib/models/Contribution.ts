import type User from "./User";

export enum ContributionState{
    Pending = "Pending",
    Published = "Published",
    Abandoned = "Abandoned",
};

export class Contribution{
    
    constructor(
        public author: User,
        public text: string,
        public state: ContributionState,
        public publicationDatetime: Date,
        public isSeed: boolean,
    ){}

    public static newFromObj(obj:any){
        return new Contribution(
            obj.author, 
            obj.text, 
            obj.state,
            new Date(obj.publicationDatetime),
            obj.isSeed,
        );
    }
}