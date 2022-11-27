<script>
    // landing page
    import LoginStatus from "$lib/components/LoginStatus.svelte";
    import { onMount } from 'svelte';
	import { strapiService } from "$lib/services/StrapiService";
	import { ContributionState } from "$lib/models/Contribution";

    onMount(async() => {
        let contributions = await strapiService.getContributions();
        console.log(contributions);
        console.log(contributions[0].state == ContributionState.Published);
    });
</script>

<h1>Welcome to Permacriture</h1>
<LoginStatus />

