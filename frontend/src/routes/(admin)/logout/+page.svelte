<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import UserStore from '$lib/stores/user.store';

    onMount(() => {
        UserStore.clear();
        goto("/login");
    });
</script>

