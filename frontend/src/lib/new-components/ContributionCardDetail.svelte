<script lang="ts">
    import ContributionCardBackground from "./ContributionCard/ContributionCardBackground.svelte";
    import Counter from './ContributionCard/decoration/Counter.svelte';
    import LinkToMe from "./ContributionCard/decoration/LinkToMe.svelte";
    import BottomCounter from "./ContributionCard/decoration/BottomCounter.svelte";
    import ParentChildrenLinks from "./ContributionCard/ParentChildrenLinks.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;
    

    function linkToMe(){
        console.log("show link modal (todo)");
    }
</script>


{#key contribution}

<div class="contribution-card">
    <div class="top-decoration">
        {#if contribution.state === ContributionState.Published}
            <Counter count={contribution.children.length} isGraine={contribution.isGraine}/>
            <ParentChildrenLinks contributionIds={contribution.children} heightOffset="-5px"/>
            <LinkToMe isGraine={contribution.isGraine} on:click={linkToMe} />
        {/if}
    </div>

    <ContributionCardBackground 
        contribution={contribution} 
        height={0} 
        isInDetailCard={true}/>
    
    {#if !contribution.isGraine}
        <div class="bottom-decoration">
            <BottomCounter count={contribution.parents.length}/>
            <ParentChildrenLinks contributionIds={contribution.parents} heightOffset="5px"/>
        </div>
    {/if}
</div>

{/key}


<style>
    .contribution-card{
        width: 100%;
    }
    .top-decoration, .bottom-decoration{
        display: flex;
    }
</style>