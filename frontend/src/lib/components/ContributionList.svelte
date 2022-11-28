<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "./ContributionCard.svelte";


    export let contributions:Contribution[] = [];
</script>

<div class="contribution-list">
    {#each contributions as contribution}
        <ContributionCard contribution={contribution} />
    {/each}
</div>


<style lang="scss">
    .contribution-list{
        height: 100%;
        overflow-y: scroll;
    }
</style>