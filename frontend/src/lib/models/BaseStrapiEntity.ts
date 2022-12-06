import { newDateOrNull } from "$lib/services/dateUtils";
import type { id } from "./Id";

export class BaseStrapiEntity
{
    public id!: id;
    public createdAt!: Date;
    public updatedAt!: Date;

    constructor(obj: any){
        this.id = obj.id;
        this.createdAt = newDateOrNull(obj.createdAt) as Date;
        this.updatedAt = newDateOrNull(obj.updatedAt) as Date;
    }
}