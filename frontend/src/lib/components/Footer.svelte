<script lang="ts">
	import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import UserStore from '$lib/stores/user.store';
    // @ts-ignore
    const appVersion = __APP_VERSION__;
</script>


<footer>
    <p>
        Permacriture, version {appVersion} 
    </p>
    {#if $UserStore.user}
        <p>
            connexion en tant que {$UserStore.user.userContext.author.nickname} 
        </p>
        <Button buttonType="danger" on:click={() => goto("/logout")}>se déconnecter</Button>
    {/if}
</footer>

<style>
    footer{
        font-size: 14px;
        color: var(--color-text-selected);
        text-align: center;
        padding-bottom: 40px;
    }

    p{
        line-height: 0.4em;
    }
</style>
