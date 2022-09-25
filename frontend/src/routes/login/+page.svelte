<script>
    import { goto } from "$app/navigation";
    import Config from "$lib/services/Config";
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
        
        const jwt = decodedResp.jwt;
        const user = { id: decodedResp.user.id, nickname: decodedResp.user.username };
        UserStore.setUser(jwt, user);

        goto("/");
    }

</script>

<h2>login</h2>
<form on:submit|preventDefault={submit}>
    <input type="email" label="email" placeholder="your email" bind:value={email}>
    <input type="password" label="password" placeholder="your password" bind:value={password}>
    <button type='submit' disabled={!email || !password}>Submit</button>
</form>

{#if error}
    <p>{error}</p>
{/if}