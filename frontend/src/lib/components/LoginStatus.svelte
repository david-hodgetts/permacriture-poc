<script>
    import UserStore from '$lib/stores/user.store';
</script>


{#if $UserStore.user}
    <p>
        cryptonyme {$UserStore.user.context.author.nickname} | {$UserStore.user.context.terrain.title}
        <a href="/logout">sortir du terrain</a>
    </p>
{/if}

<style>
    p{
        margin: 0;
        padding: 0;
    }
</style>