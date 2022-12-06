<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import ContributionEditor from "$lib/components/ContributionEditor.svelte"
    import { onMount } from 'svelte';
	import { strapiService } from "$lib/services/StrapiService";
	import type { Contribution } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";

    let contributions: Contribution[] = [];
    let selectedContribution: Contribution | null = null;

    onMount(async() => {
        contributions = await strapiService.getContributions();
        console.log(contributions);
    });

    function onCardSelectionRequest(e:any){
        selectedContribution = e.detail.contribution;
    }

    async function onNewContributionRequest(e:any){
        console.log(onNewContributionRequest);
        const parentContribution = e.detail.contribution;
        let newContributionId = await strapiService.createNewContributionFromParent(parentContribution);
        console.log(newContributionId);
        if(newContributionId == -1){
            // TODO: handle error for user
            console.error("unable to create new contribution");
            return;
        }

        // open the editor
        // goto(`/editor/${newContributionId}`);

    }

</script>



<!-- dom -->

{#if selectedContribution === null}
    <ContributionList 
        contributions={contributions} 
        on:cardSelectionRequest={onCardSelectionRequest} 
        on:newContributionRequest={onNewContributionRequest}
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

