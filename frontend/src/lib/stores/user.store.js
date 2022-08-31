import { clearJwt, clearNickname, getJwt, getNickname, storeJwt, storeNickname } from "$lib/services/LocalStorage";
import { writable } from "svelte/store";
import { browser } from '$app/env';

function createUserStore() {
	const { subscribe, set } = writable({
        nickname: getNickname(),
        jwt: getJwt(),
    });

	return {
		subscribe,
        /**
         * 
         * @param {string} jwt token
         * @param {string} nickname 
         */
        setUser: (jwt, nickname) => {
            storeJwt(jwt);
            storeNickname(nickname);
            set({ nickname, jwt });
        },
		clear: () => {
            clearJwt();
            clearNickname();
            set({ nickname: "", jwt: "" });
        }
	};
}

export default createUserStore();