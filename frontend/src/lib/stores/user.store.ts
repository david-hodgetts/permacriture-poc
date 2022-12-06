import type User from "$lib/models/User";
import { clearJwt, clearUser, getJwt, getUser, storeJwt, storeUser } from "$lib/services/LocalStorage";
import { writable } from "svelte/store";


function createUserStore() {
 
	const { subscribe, set } = writable({
        user: getUser(),
        jwt: getJwt(),
    });

	return {
		subscribe,
        setUser: (user: User, jwt: string) => {
            storeJwt(jwt);
            storeUser(user);
            set({ user, jwt });
        },
		clear: () => {
            clearJwt();
            clearUser();
            set({ user: null, jwt: "" });
        }
	};
}

export default createUserStore();