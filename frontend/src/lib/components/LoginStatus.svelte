<script>
    import UserStore from '$lib/stores/user.store';
</script>


{#if $UserStore.user}
    <p>logged in as {$UserStore.user.nickname}</p>
    <a href="/logout">logout</a>
{:else}
    <p>you are not logged in</p>
    <a href="/login">login</a>
{/if}
