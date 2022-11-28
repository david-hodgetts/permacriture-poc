<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import { onMount } from 'svelte';
	import { strapiService } from "$lib/services/StrapiService";
	import { Contribution, ContributionState } from "$lib/models/Contribution";

    let contributions: Contribution[] = [];

    onMount(async() => {
        contributions = await strapiService.getContributions();
        console.log(contributions);
        console.log(contributions[0].state == ContributionState.Published);
    });
</script>

<ContributionList  contributions={contributions} />


<style lang="scss">

</style>

