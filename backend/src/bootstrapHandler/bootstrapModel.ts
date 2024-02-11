import { Strapi } from "@strapi/strapi";

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
    contribution_min_publication_delay_minutes: number; // min minutes before user can force publication
    contribution_max_publication_delay_minutes: number; // threshold after which contribution will be automatically published,

    cryptonims: string[],
    grainePublicationDatetime: DayDate,
    graines: Graine[],
}

export interface Terrain{
    title: string;
    description: string;
    start: DayDate;
    end: DayDate;
    contribution_min_publication_delay_minutes: number; // min minutes before user can force publication
    contribution_max_publication_delay_minutes: number; // threshold after which contribution will be automatically published,

    cryptonims: string[],
    users: UserAuthorPair[],
    grainePublicationDatetime: DayDate,
    graines: Graine[],
}


function genPassword():string{
    const charCount = 8;
    return Math.random().toString(36).slice(charCount * -1);
}

export async function cryptonimToUserAuthorPair(cryptonim: string): Promise<UserAuthorPair>{
    const username = await computeUniqueUsername(cryptonim);
    const emailDomain = "permacriture.org";
    const email = `${username.toLocaleLowerCase()}@${emailDomain}`;
    console.log(`email ${email} and username ${username} computed for cryptonim -> ${cryptonim}`);
    return {
        user:{
            username: username,
            email: email,
            password:genPassword(),
        },
        author:{
            nickname: username,
        }
    }
}

export function ingestTerrainData(terrainJson:TerrainJSON): Terrain{

    const result: Terrain = {
        title: terrainJson.title,
        description: terrainJson.description,
        start: terrainJson.start,
        end: terrainJson.end,
        contribution_min_publication_delay_minutes: terrainJson.contribution_min_publication_delay_minutes,
        contribution_max_publication_delay_minutes: terrainJson.contribution_max_publication_delay_minutes,
        cryptonims:  terrainJson.cryptonims,
        users: [], // filled later
        grainePublicationDatetime: terrainJson.grainePublicationDatetime,
        graines: terrainJson.graines
    }

    return result;
}

export function dayDateToDate(dayDate: DayDate): Date{
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}

async function usernameExists(username:string): Promise<boolean> {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {username: username},
    });

    return !!user;
}

async function userWithEmailExists(email:string): Promise<boolean> {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {email: email},
    });

    return !!user;
}

export async function computeUniqueUsername(cryptonim: string): Promise<string> {
    let username = cryptonim;
    let userExists = await usernameExists(username );
    let index = 2;
    while(userExists){
        username = `${cryptonim}_${index}`;
        userExists = await usernameExists(username);
        index++;
    }
    return username;
}


