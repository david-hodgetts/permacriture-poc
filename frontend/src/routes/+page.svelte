<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
	import ContributionCard from "$lib/components/ContributionCard.svelte";
    import { onMount } from 'svelte';
	import type { PageData } from "./$types";
	import { strapiService } from "$lib/services/StrapiService";
	import type { Contribution } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";

    export let data: PageData;
    
    let selectedContribution: Contribution | null = null;

    function onCardSelectionRequest(e:any){
        selectedContribution = e.detail.contribution;
    }

    async function onNewContributionRequest(e:any){
        const parentContribution = e.detail.contribution;
        const newContributionId = await strapiService.createNewContributionFromParent(parentContribution);
        console.log(newContributionId);
        if(newContributionId == -1){
            // TODO: handle error for user
            console.error("unable to create new contribution");
            return;
        }

        // open the editor 
        goto(`/editor/${newContributionId}`);
    }

</script>



<!-- dom -->

{#if selectedContribution === null}
    <ContributionList 
        contributions={data.contributions} 
        on:cardSelectionRequest={onCardSelectionRequest} 
        on:newContributionRequest={onNewContributionRequest}
    />
{:else}
    <ContributionCard 
        contribution={selectedContribution} 
        isFocused={true}
        on:newContributionRequest={onNewContributionRequest}
        on:closeRequest={() => selectedContribution = null}
    />
{/if}


