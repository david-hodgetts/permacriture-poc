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

export interface Graine{
    text: string,
}

export interface TerrainJSON{
    title: string;
    description: string;
    start: DayDate;
    end: DayDate;
    contribution_publication_delay: number; // hours,

    cryptonims: string[],
    grainePublicationDatetime: DayDate,
    graines: Graine[],
}

export interface Terrain{
    title: string;
    description: string;
    start: DayDate;
    end: DayDate;
    contribution_publication_delay: number; // hours,

    users: UserAuthorPair[],
    grainePublicationDatetime: DayDate,
    graines: Graine[],
}


function genPassword():string{
    const charCount = 8;
    return Math.random().toString(36).slice(charCount * -1); 
}

function cryptonimToUserAuthoPair(cryptonim: string): UserAuthorPair{
    return {
        user:{
            username: cryptonim,
            email: `${cryptonim.toLowerCase()}@test.test`,
            password:genPassword(),
        },
        author:{
            nickname: cryptonim,
        }
    }
}

export function terrainJSONToTerrain(terrainJson:TerrainJSON): Terrain{
    const result: Terrain = {
        title: terrainJson.title,
        description: terrainJson.description,
        start: terrainJson.start,
        end: terrainJson.end,
        contribution_publication_delay: terrainJson.contribution_publication_delay,
        users: terrainJson.cryptonims.map(cryptonimToUserAuthoPair),
        grainePublicationDatetime: terrainJson.grainePublicationDatetime,
        graines: terrainJson.graines
    }

    return result;
}

export function dayDateToDate(dayDate: DayDate): Date{
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}