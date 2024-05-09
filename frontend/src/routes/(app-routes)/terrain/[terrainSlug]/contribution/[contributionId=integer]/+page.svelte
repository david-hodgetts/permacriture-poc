<script lang="ts">
	import type { PageData } from "./$types";
    import ContributionCardDetail from "$lib/components/ContributionCardDetail.svelte";
    import Map from "$lib/components/Map.svelte";
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
    import { page } from "$app/stores";

    export let data: PageData;

    let mapContainer: HTMLElement;

    let colWidth:number;
    let terrainSlug = $page.params.terrainSlug;

    onMount(() => {
        addEventListener('resize', onResize);
        onResize();
    });

    onDestroy(() => {
        removeEventListener('resize', onResize);
    });

    function onResize(){
        if(mapContainer){
            const screenWidth = window.innerWidth;
            const offset = (screenWidth - colWidth) / 2;
            // console.log("colwidth", colWidth, "screen width", screenWidth, "offset", offset);
            mapContainer.style.left = `${-offset}px`;
        }
    }


    function onContributionSelectionRequest(e:any){
        const contributionId = e.detail.id;
        goto(`/terrain/${terrainSlug}/contribution/${contributionId}`);
    }
</script>


<!-- dom -->

<div bind:clientWidth={colWidth} class="container">

    <div class="card">
        <ContributionCardDetail
            contribution={data.contribution} 
            on:contributionSelection={onContributionSelectionRequest}
        />
    </div>

    <div bind:this={mapContainer} class="map">
        <Map 
        data={data.mapData} 
        on:contributionSelection={onContributionSelectionRequest}
        />
    </div>
</div>
    

<style>
    .container{
        display: flex;
        flex-direction: column;
        height: calc(100svh - var(--navbar-height-map));
        width: 100%;
        padding-top: 20px;
    }

    .map{
        position:relative;
        width: 100svw;
        flex: 1;
    }

    .card{
        width: 100%;
    }
</style>