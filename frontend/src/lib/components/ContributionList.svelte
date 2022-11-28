<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "./ContributionCard.svelte";
    import { createEventDispatcher } from 'svelte';

    export let contributions:Contribution[] = [];

    const dispatch = createEventDispatcher();
    
    function onCardSelectionRequest(e:any){
        dispatch("cardSelectionRequest", e.detail);
    }
</script>

<div 
    class="contribution-list"
>
    {#each contributions as contribution }
        <ContributionCard 
            contribution={contribution} 
            on:cardSelectionRequest={onCardSelectionRequest} />
    {/each}
</div>


<style lang="scss">
    .contribution-list{
        height: 100%;
        overflow-y: scroll;
    }
</style>