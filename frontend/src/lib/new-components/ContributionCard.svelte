<script lang="ts">
    import ContributionCardBackground from "./ContributionCard/ContributionCardBackground.svelte";
    import Counter from './ContributionCard/Counter.svelte';
    import BottomCounter from "./ContributionCard/BottomCounter.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    const cardHeight = contribution.state == ContributionState.Editing ? 187 : 289
</script>

<div class="contribution-card">

    <div class="top-decoration">
        {#if contribution.state === ContributionState.Published}
            <Counter count={contribution.children.length} />
            <div class="link-to-contribution">
                <img src="/images/linkToMe.svg" alt="">
                <div class="text">se perlier</div>
            </div>
        {/if}
    </div>
    <ContributionCardBackground contribution={contribution} height={cardHeight}/>
    <div class="bottom-decoration">
        <BottomCounter count={contribution.parents.length} />
    </div>
</div>


<style>
    .contribution-card{
        width: 100%;
    }
    .top-decoration, .bottom-decoration{
        display: flex;
    }
    .link-to-contribution{
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-left: auto; /* forces right align */
    }
    .link-to-contribution > img{
        width: 42px;
        height: 35px;
    }
    .text{
        color: var(--color-secondary);
        font-size:18px;
        font-weight: bold;
    }
</style>