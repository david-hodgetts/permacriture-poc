import type { id } from "./Id";

export interface Link{
    id: id,
    parent: id,
    child: id,
    isFirstLink: boolean,
}