<script lang="ts">
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    const badgeTextColor = contribution.isGraine ? "#000" : "#fff";
    console.log("contrib color", contribution.color);
</script>

<div class="header">
    <ContributorBadge 
        isGraine={contribution.isGraine} 
        backgroundColor={contribution.color} 
        text={contribution.badgeText} />
    <div 
        class="nickname"
        class:notPublished={contribution.state == ContributionState.Editing}
        class:graine={contribution.isGraine}
    >{contribution.nickname}</div>
</div>


<style>
    .header{
        padding-top: 15px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        align-items: center;
        color: var(--color-text-default);
    }

    .nickname{
        padding-left: 15px;
        font-size: 19px;
        font-weight: bold;
    }

    .notPublished{
        color: var(--color-text-faded);
    }

    .graine{
        color: var(--color-text-selected);
    }
</style>