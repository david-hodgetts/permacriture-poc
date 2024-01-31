<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "$lib/new-components/ContributionCard.svelte";
    import Footer from "$lib/new-components/Footer.svelte";
    import TerrainTitle from "$lib/new-components/TerrainTitle.svelte";

    export let contributions:Contribution[] = [];
</script>

<div class="contribution-list">
    {#each contributions as contribution (contribution.id) }
        <ContributionCard 
            contribution={contribution} 
            on:showDetailRequest
        />
    {/each}
    <Footer />
</div>


<style lang="scss">
    .contribution-list{
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;
        padding-top: 20px;
        padding-top: 40px;
        // overflow-y: scroll;
    }
</style>