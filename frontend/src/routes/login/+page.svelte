<script>
    import Config from "$lib/Config";
    import { storeJwt, storeNickname } from '$lib/LocalStorage';


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
            error = (await resp.json()).message;
            return;
        }
        // happy path
        const decodedResp = await resp.json();

        storeJwt(decodedResp.jwt);
        storeNickname(decodedResp.user.username);
    }

</script>

<h2>login</h2>
<form on:submit|preventDefault={submit}>
    <input type="email" label="email" placeholder="your email" bind:value={email}>
    <input type="password" label="password" placeholder="your password" bind:value={password}>
    <button type='submit'>Submit</button>
</form>

{#if error}
    <p>we encoutered the following error {error}</p>
{/if}