<script lang="ts">
    import ContributionRoundButton from "./ContributionRoundButton.svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";

    export let contributions:Contribution[] = [];
    
    const dispatch = createEventDispatcher();

    function onClick(e){
        dispatch('contributionSelectionRequest', e.detail);
    }

</script>

<div class="button-list">
    {#each contributions as contribution}
        <ContributionRoundButton  
            id={contribution.id} 
            name={contribution.authorAbbrev}
            on:click={onClick}   
        /> 
    {/each}
</div>



<style>
    .button-list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 40px;
        padding-bottom: 40px;
    }
</style>