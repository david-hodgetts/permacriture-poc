import { clearJwt, clearNickname, getJwt, getNickname, storeJwt, storeNickname } from "$lib/services/LocalStorage";
import { writable } from "svelte/store";
import { browser } from '$app/env';

function createUserStore() {
	const { subscribe, set } = writable({
        nickname: browser ? getNickname() : "",
        jwt: browser ? getJwt() : "",
    });

	return {
		subscribe,
        /**
         * 
         * @param {string} jwt token
         * @param {string} nickname 
         */
        setUser: (jwt, nickname) => {
            if(browser){
                storeJwt(jwt);
                storeNickname(nickname);
            }
            set({nickname, jwt});
        },
		clear: () => {
            if(browser){
                clearJwt();
                clearNickname();
            }
            set({nickname: "", jwt: ""});
        }
	};
}

export default createUserStore();