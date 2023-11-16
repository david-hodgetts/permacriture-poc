export interface DayDate{
    day: number,
    month: number,
    year: number,
}

export interface UserAuthorPair{
    user: User,
    author: Author,
}

export interface User{
    username: string,
    email: string,
    password: string,
}

export interface Author{
    nickname: string,
}

export interface Terrain{
    title: string;
    description: string;
    start: DayDate;
    end: DayDate;
    contribution_publication_delay: number; // hours,

    users:UserAuthorPair[],
}


export function dayDateToDate(dayDate: DayDate): Date{
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}