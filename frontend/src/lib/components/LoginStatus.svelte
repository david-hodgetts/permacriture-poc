<script>
    import UserStore from '$lib/stores/user.store';
</script>


{#if $UserStore.nickname}
    <p>logged in as {$UserStore.nickname}</p>
{:else}
    <p>you are not logged in</p>
{/if}
