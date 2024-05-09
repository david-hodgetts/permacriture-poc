<script lang="ts">
	import type { PageData } from "./$types";
	import TerrainTitle from "$lib/components/TerrainTitle.svelte";
	import EditorSystem from "$lib/components/EditorSystem.svelte";
    
    export let data: PageData;
</script>


<TerrainTitle/>
<EditorSystem contribution={data.contribution} />