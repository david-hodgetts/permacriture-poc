<script lang="ts">
    import ContributionMiniButton from "./ContributionMiniButton.svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";

    export let contributions:Contribution[] = [];
    
    const dispatch = createEventDispatcher();

    function onContributionSelectionRequest(e:any){
        dispatch('contributionSelectionRequest', e.detail);
    }

    function onModalCloseRequest(e:any){
        dispatch('endFocusMode', {});
    }

</script>

<div class="button-list" on:click={onModalCloseRequest}>
    {#each contributions as contribution (contribution.id)}
        <ContributionMiniButton  
            contribution={contribution}
            on:click={onContributionSelectionRequest}   
        /> 
    {/each}
</div>



<style>
    .button-list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 100%;
    }
</style>