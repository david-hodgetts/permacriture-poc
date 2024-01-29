<script lang="ts">
	import type { PageData } from "./$types";
    import Map from "$lib/new-components/Map.svelte";
	import Slider from "$lib/components/Slider.svelte";
	import TerrainTitle from "$lib/new-components/TerrainTitle.svelte";

    export let data:PageData;

    let separation = 50; 

</script>

<div class="fixed">
    <Slider width="316px" min={0} value={separation} max={100} on:input={ (e) => { separation = e.detail.value; } } />
    <TerrainTitle />
</div>

<div class="map">
    <Map data={data} separation={separation} />
</div>

<style>
    :root{
        --fixed-element-height: 80px;
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
        height: calc(100svh - (var(--navbar-height-map) + var(--fixed-element-height)));
    }
</style>

