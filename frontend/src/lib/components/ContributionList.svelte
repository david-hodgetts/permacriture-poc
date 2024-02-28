<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "$lib/components/ContributionCard.svelte";
    import Footer from "$lib/components/Footer.svelte";

    export let contributions:Contribution[] = [];
</script>

<div class="contribution-list">
    {#if contributions.length > 0}
        {#each contributions as contribution (contribution.id) }
            <ContributionCard 
                contribution={contribution} 
                on:showDetailRequest
            />
        {/each}
    {:else}
        <div class="no-content">
            Vous n'avez pas encore rédigé de texte.<br>
            Passez sur la vue <u>tous les textes</u> et sélectionner <u>esperlier</u> 
            sur un texte qui vous intéresse pour&nbsp;commencer.
        </div>
    {/if}
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

    .no-content{
        padding-top: 40px;
        padding-bottom: 10px;
        text-align: center;
        line-height: 1.3em;
    }
</style>