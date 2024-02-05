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

<div class="login">
    <h2>Entrer sur le terrain (login)</h2>
    <form on:submit|preventDefault={submit}>
        <div>
            <label for="email">courriel:</label>
            <input type="email" name="email" placeholder="votre courriel" bind:value={email}>
        </div>
        <div>
            <label for="password">mot de passe:</label>
            <input type="password" name="password" placeholder="votre mot de passe" bind:value={password}>
        </div>
        <button type="submit" disabled={!email || !password}>soumettre</button>
    </form>
</div>

{#if error}
    <p>{error}</p>
{/if}


<style>
    .login{
        margin-top: 60px;
    }
    h2{
        font-size: 18px;
        color: var(--color-text-default);
    }

    form{
        display: flex;
        flex-direction: column;
        max-width: 300px;
        gap: 20px;
    }

    input{
        width: 100%;
    }
    
    input:-webkit-autofill {
        -webkit-box-shadow: inset 0 0 0px 9999px white;
    }
    
    input[type="email"], input[type="password"], 
    input[type="email"]:focus, input[type="password"]:focus, input:active, input:autofill {
        background-color : white; 
    }

    button{
        border: 0;
        border-radius: 6px;
        width: 100%;
        height: 40px;
        cursor: pointer;
        /* padding: 0px 20px; */
        font-weight: bold;
        font-size: 18px;
        background-color: var(--color-background-accent);
        color:white;
    }

    button:disabled{
        background-color: var(--color-text-faded);
        cursor: auto;
    }
</style>