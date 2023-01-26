<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "./ContributionCard.svelte";
    import { createEventDispatcher } from 'svelte';

    export let contributions:Contribution[] = [];
</script>

<div class="contribution-list">
    {#each contributions as contribution }
        <ContributionCard 
            contribution={contribution} 
            on:cardSelectionRequest
        />
    {/each}
</div>


<style lang="scss">
    .contribution-list{
        height: 100%;
        overflow-y: scroll;
    }
</style>