<script lang="ts">
	import type { PageData } from "./$types";
    import Map from "$lib/new-components/Map.svelte";

    export let data:PageData;

</script>


<div class="map">
    <Map data={data} />
</div>


