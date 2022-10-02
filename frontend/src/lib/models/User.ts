export default interface User
{
    id: number;
    nickname: string;
    context: Context;
}

export interface Context
{
    terrain: {
        id: number,
        title: string,
    }
}