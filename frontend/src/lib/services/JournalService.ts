import { Order, Filter } from "$lib/models/Contribution";

export interface JournalState{
    scrollPosition: number;
    order: Order;
    filter: Filter;
}

class JournalService
{
    // default value
    private _state:JournalState = {
        scrollPosition:0,
        order: Order.Descending,
        filter: Filter.all,
    };


    public set state(value:JournalState){
        this._state = value;
    }

    public get state(): JournalState{
        return this._state;
    }
}

export const journalService = new JournalService();