<script lang="ts">
	import type { PageData } from "./$types";
    import Map from "$lib/components/Map.svelte";
	import Slider from "$lib/components/Slider.svelte";
	import TerrainTitle from "$lib/components/TerrainTitle.svelte";
	import { goto } from "$app/navigation";

    export let data:PageData;

    let separation = 50; 

    function onContributionSelection(e:any){
        const { id } = e.detail;
        console.log("contrib ", id);
        goto(`/contribution/${id}`);
    }

    function onContributionUnSelected(e:any){
        goto('/map');
    }

</script>


<div class="fixed">
    <div style="pointer-events:auto">
        <Slider 
            width="316px" 
            min={0} 
            max={100} 
            value={separation} 
            on:input={ (e) => separation = e.detail.value } />
        <TerrainTitle />
    </div>
</div>


<div class="map">
    <Map 
        data={data} 
        separation={separation} 
        on:contributionSelection={onContributionSelection}
        on:contributionUnSelected={onContributionUnSelected}
        />
</div>

<style>
    :root{
        --fixed-element-height: 80px;
        --total-fixed-element-height: calc(var(--navbar-height-map) + var(--fixed-element-height));
        --card-height: 289px;
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
        pointer-events: none;
        z-index: 10;
    }

    .map{
        position:fixed;
        top: 0;
        left: 0;
        width: 100svw;
        height: 100svh;
    }

</style>

