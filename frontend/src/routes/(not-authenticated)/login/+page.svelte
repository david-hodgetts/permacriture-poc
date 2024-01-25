<script lang="ts">
    import { goto } from "$app/navigation";
    import Config from "$lib/services/Config";
	import { strapiService } from "$lib/services/StrapiService";
    import type User from "$lib/models/User";
    import UserStore from '$lib/stores/user.store';

    let email = "";
    let password = "";
    let error = "";

    async function submit(){
        // TODO: move this to a service
        const url = `${Config.baseUrl}/api/auth/local`;
        const body = {
            identifier: email,
            password: password,
        };

        const resp = await fetch(url, {
            method: 'POST',
			body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
		});

        if(!resp.ok){
            if(resp.status == 400){
                error = "invalid login";
                email = "";
                password = "";
            }else{
                error = `${resp.status} -> ${resp.statusText}`; 
            }
            return;
        }

        // happy path
        const decodedResp = await resp.json();
        console.log("logged-in as", decodedResp);
       
        // 1 get jwt
        const jwt = decodedResp.jwt;

        // get user context with jwt
        const context = await strapiService.getContext(jwt);
        console.log("context", context);

        if(!context){
            error = `unable to get context`;
            return;
        }
        // persist user
        const user: User = { 
            id: decodedResp.user.id, 
            context: context,
        };
        UserStore.setUser(user, jwt);

        goto("/");
    }

</script>

<h2>entrer sur le terrain (login)</h2>
<form on:submit|preventDefault={submit}>
    <input type="email" label="email" placeholder="votre courriel" bind:value={email}>
    <input type="password" label="password" placeholder="votre mot de passe" bind:value={password}>
    <button type='submit' disabled={!email || !password}>soumettre</button>
</form>

{#if error}
    <p>{error}</p>
{/if}