<script lang="ts">
	import type { PageData } from "./$types";
    import ContributionCard from "$lib/components/ContributionCard.svelte";
	import ContributionMiniCardList from "$lib/components/ContributionMiniCardList.svelte";
	import { goto } from "$app/navigation";

    export let data: PageData;


    function onContributionSelectionRequest(e:any){
        const contributionId = e.detail.contributionId;
        goto(`/contribution/${contributionId}`);
    }
</script>


<!-- dom -->


<div class="modal">

    <!-- parent contributions -->
    <div class="top">
        <ContributionMiniCardList 
            contributions={data.parentContributions}
            showTotalParentCount={true}
            on:contributionSelectionRequest={onContributionSelectionRequest}
            on:endFocusMode={() => goto("/")}
        />
    </div>

    <!-- focused contribution card -->
    <ContributionCard 
        contribution={data.contribution} 
        isFocused={true}
    />
    
    <!-- child contributions -->
    <div class="bottom">
        <ContributionMiniCardList 
            contributions={data.childContributions}
            showTotalChildrenCount={true}
            on:contributionSelectionRequest={onContributionSelectionRequest}
            on:endFocusMode={() => goto("/")}
        />
    </div>
</div>


<style>
    .modal{
        position: fixed;
        top: var(--navbar-height);
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
        height: calc(100% - var(--navbar-height));
    }
    .top{
        width: 100%;
        height: 20%;
    }
    .bottom{
        width: 100%;
        min-height: 20%;
    }
    
</style>