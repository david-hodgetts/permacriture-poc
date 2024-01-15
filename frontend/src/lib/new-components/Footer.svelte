<script lang="ts">
    import Button from "$lib/new-components/Button.svelte";
    import UserStore from '$lib/stores/user.store';
    import { goto } from '$app/navigation';
    // @ts-ignore
    const appVersion = __APP_VERSION__;

</script>


<footer>
    <p>
        Permacriture, version {appVersion} 
    </p>
    <p>
        Vous êtes connecté en tant que {#if $UserStore.user} 
            {$UserStore.user.context.author.nickname} 
        {/if}
    </p>
    <Button buttonType="danger" on:click={() => goto("/logout")}>se déconnecter</Button>
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
