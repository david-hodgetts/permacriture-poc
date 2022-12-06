// note for self -> The keys and the values stored with localStorage are always in the UTF-16 string format.

import type User from "$lib/models/User";



const keys = {
    jwt: "perma_jwt",
    user: "user",
};



export function storeJwt(jwt:string){
    return storeItem(keys.jwt, jwt);
}
export function getJwt(): string | null{
    return getItem(keys.jwt);
}
export function clearJwt(){
    removeItem(keys.jwt);
}




export function storeUser(user: User){
    return storeItem(keys.user, JSON.stringify(user));
}
export function getUser():User | null{
    try{
        const userJson = getItem(keys.user);
        if(userJson){
            const user = JSON.parse(userJson);
            return user as User;
        }
    }catch(e){
        console.error(e);
    }
    return null;
}
export function clearUser(){
    removeItem(keys.user);
}


function getItem(key:string): string | null{
    try{
        const value = localStorage.getItem(key);
        return value;
    }catch(e){
        console.error(e);
        return null;
    }
}

function storeItem(key:string, value:string){
    try{
        localStorage.setItem(key, value);
    }catch(e){
        console.error(e);
        return false;
    }

    return true;
}

function removeItem(key:string){
    try{
        localStorage.removeItem(key);
    }catch(e){
        console.error(e);
    }
}