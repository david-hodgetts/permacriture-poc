<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import ContributionEditor from "$lib/components/ContributionEditor.svelte"
    import { onMount } from 'svelte';
	import { strapiService } from "$lib/services/StrapiService";
	import { Contribution, ContributionState } from "$lib/models/Contribution";

    let contributions: Contribution[] = [];
    let selectedContribution: Contribution | null = null;

    onMount(async() => {
        contributions = await strapiService.getContributions();
        console.log(contributions);
        console.log(contributions[0].state == ContributionState.Published);
    });

    function onCardSelectionRequest(e:any){
        console.log("youpi", e.detail.contribution);
        selectedContribution = e.detail.contribution;
    }

</script>



<!-- dom -->

{#if selectedContribution === null}
    <ContributionList 
        contributions={contributions} 
        on:cardSelectionRequest={onCardSelectionRequest} 
    />
{:else}
    <ContributionEditor 
        contribution={selectedContribution} 
        on:closeRequest={() => selectedContribution = null}
    />
{/if}




<!-- style -->
<style lang="scss">

</style>

