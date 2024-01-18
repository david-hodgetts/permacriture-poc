<script lang="ts">
    import ContributionCardBackground from "./ContributionCard/ContributionCardBackground.svelte";
    import Counter from './ContributionCard/decoration/Counter.svelte';
    import LinkToMe from "./ContributionCard/decoration/LinkToMe.svelte";
    import BottomCounter from "./ContributionCard/decoration/BottomCounter.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    const cardHeight = contribution.state == ContributionState.Editing ? 187 : 289

    function linkToMe(){
        console.log("show link modal (todo)");
    }
</script>

<div class="contribution-card">
    <div class="top-decoration">
        {#if contribution.state === ContributionState.Published}
            <Counter count={contribution.children.length} isGraine={contribution.isGraine}/>
            <LinkToMe isGraine={contribution.isGraine} on:click={linkToMe} />
        {/if}
    </div>

    <ContributionCardBackground contribution={contribution} height={cardHeight}/>
    
    {#if !contribution.isGraine}
        <div class="bottom-decoration">
            <BottomCounter count={contribution.parents.length} />
        </div>
    {/if}
</div>


<style>
    .contribution-card{
        width: 100%;
    }
    .top-decoration, .bottom-decoration{
        display: flex;
    }
</style>