<script>
    import UserStore from '$lib/stores/user.store';
</script>


{#if $UserStore.user}
    <p>
        user {$UserStore.user.context.author.nickname} | {$UserStore.user.context.terrain.title}
        <a href="/logout">logout</a>
    </p>
{/if}

<style>
    p{
        margin: 0;
        padding: 0;
    }
</style>