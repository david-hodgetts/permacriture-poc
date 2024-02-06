<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "$lib/components/ContributionCard.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import TerrainTitle from "$lib/components/TerrainTitle.svelte";

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
        gap: 50px;
        height: 100%;
        padding-top: 20px;
        padding-top: 40px;
        // overflow-y: scroll;
    }
</style>