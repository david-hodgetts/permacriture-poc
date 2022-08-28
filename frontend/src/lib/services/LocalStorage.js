// note for self -> The keys and the values stored with localStorage are always in the UTF-16 string format.

const keys = {
    jwt: "perma_jwt",
    nickname: "perma_nickname",
};

/**
 * 
 * @param { string } jwt
 * @returns { boolean } success status
 */
export function storeJwt(jwt){
    return storeItem(keys.jwt, jwt);
}

/**
 * 
 * @returns { string | null }
 */
export function getJwt(){
    return getItem(keys.jwt);
}

export function clearJwt(){
    removeItem(keys.jwt);
}


/**
 * 
 * @param { string } nickname 
 * @returns { boolean } success status
 */
export function storeNickname(nickname){
    return storeItem(keys.nickname, nickname);
}


/**
 * 
 * @returns { string | null }
 */
export function getNickname(){
    return getItem(keys.nickname);
}

export function clearNickname(){
    removeItem(keys.nickname);
}

/**
 * retrieves value at key in Localstorage
 * @param { string } key
 * @returns { string | null } null in case of error
 */
function getItem(key){
    try{
        const value = localStorage.getItem(key);
        return value;
    }catch(e){
        console.error(e);
        return null;
    }
}

/**
 * stores value at key in Localstorage
 * @param { string } key 
 * @param  { string } value
 * @returns { boolean } true if successful, false otherwise
 */
function storeItem(key, value){
    try{
        localStorage.setItem(key, value);
    }catch(e){
        console.error(e);
        return false;
    }

    return true;
}

/**
 * removes value stored at key location in localstorage 
 * @param key { string }
 */
function removeItem(key){
    try{
        localStorage.removeItem(key);
    }catch(e){
        console.error(e);
    }
}