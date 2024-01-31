<script lang="ts">
	import type { PageData } from "./$types";
    import Map from "$lib/new-components/Map.svelte";
	import Slider from "$lib/components/Slider.svelte";
	import TerrainTitle from "$lib/new-components/TerrainTitle.svelte";
    import ContributionCard from "$lib/new-components/ContributionCard.svelte";
    import ContributionDetailModal from "$lib/new-components/Modals/ContributionDetailModal.svelte";
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    export let data:PageData;

    let separation = 50; 

    $: showContribution = !!data.contribution;

    $: showDetailModal = !!$page.url.searchParams.get('show-detail');

    function onContributionSelection(e){
        const { id } = e.detail;
        console.log("contrib ", id);
        goto(`/map/${id}`);
    }

    function onContributionUnSelected(e){
        goto('/map');
    }

    function onShowDetailRequest(e){
        const contributionId = e.detail.id;
        goto(`/map/${contributionId}?show-detail=true`)
    }

    function closeDetailModal(){
        if(data.contribution){
            goto(`/map/${data.contribution.id}`);
        }else{
            goto('/map');
        }
    }

</script>


<ContributionDetailModal 
    visible={showDetailModal}
    on:close={closeDetailModal}
    contribution={data.contribution} />


<div class="fixed">
    <Slider 
        width="316px" 
        min={0} 
        max={100} 
        value={separation} 
        on:input={ (e) => separation = e.detail.value } />
    <TerrainTitle />
</div>


<div class="content" >
    {#if showContribution}
    {#key data.contribution}
        <ContributionCard 
            contribution={data.contribution}
            on:showDetailRequest={onShowDetailRequest}
        />
    {/key}
    {/if}

    <div class="map" class:mapWithCard={showContribution} >
        <Map 
            data={data} 
            separation={separation} 
            on:contributionSelection={onContributionSelection}
            on:contributionUnSelected={onContributionUnSelected}
            />
    </div>
</div>

<style>
    :root{
        --fixed-element-height: 80px;
        --total-fixed-element-height: calc(var(--navbar-height-map) + var(--fixed-element-height));
        --card-height: 289px;
    }
    
    .content{
        margin-top: var(--fixed-element-height);
    }

    .fixed {
        position: fixed;
        top: var(--navbar-height-map);
        left:0;
        width: 100%;
        height: var(--fixed-element-height);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .map{
        width: 100%;
        height: calc(100svh - var(--total-fixed-element-height));
    }

    .mapWithCard{
        height: calc(100svh - (var(--total-fixed-element-height) + var(--card-height)));
    }
</style>

