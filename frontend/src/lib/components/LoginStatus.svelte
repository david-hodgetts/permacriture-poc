<script>
    import UserStore from '$lib/stores/user.store';
</script>


{#if $UserStore.nickname}
    <p>logged in as {$UserStore.nickname}</p>
    <a href="/logout">logout</a>
{:else}
    <p>you are not logged in</p>
    <a href="/login">login</a>
{/if}
