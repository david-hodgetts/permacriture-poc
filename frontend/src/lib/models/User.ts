import type Author from "./Author";
import type { id } from "./Id";

export default interface User
{
    id: id,
    userContext: UserContext,
}

export interface UserContext
{
    author: Author,
    terrain: {
        id: id,
        title: string,
        description: string,
        start: string,
        end: string,
        contribution_min_publication_delay_minutes: number,
        contribution_max_publication_delay_minutes: number,
        slug: string,
        public: boolean,
    }
}