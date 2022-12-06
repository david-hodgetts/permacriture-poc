import type Author from "./Author";
import type { id } from "./Id";

export default interface User
{
    id: id,
    context: Context,
}

export interface Context
{
    author: Author,
    terrain: {
        id: id,
        title: string,
        description: string,
        start: string,
        end: string,
        contribution_publication_delay: number,
        contribution_manual_publication_delay: number,
    }
}