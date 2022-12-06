
<script lang="ts">
	import ContributionList from "$lib/components/ContributionList.svelte";
    import ContributionEditor from "$lib/components/ContributionEditor.svelte";
	import type { PageData } from "./$types";
	import type { Contribution } from "$lib/models/Contribution";

    export let data: PageData;
    let selectedContribution: Contribution | null = null;

    function onCardSelectionRequest(e: any){
        selectedContribution = e.detail.contribution;
    }

    function onNewContributionRequest(){
        console.log("TODO pending contributions can't be linked to");
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
    <ContributionEditor 
        contribution={selectedContribution} 
        on:closeRequest={() => selectedContribution = null}
    />
{/if}


<!-- style -->
<style lang="scss">

</style>