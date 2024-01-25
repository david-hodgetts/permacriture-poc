<script lang="ts">
	import type { PageData } from "./$types";
	import TerrainTitle from "$lib/new-components/TerrainTitle.svelte";
	import EditorSystem from "$lib/new-components/EditorSystem.svelte";
    
    export let data: PageData;
</script>


<TerrainTitle/>
<EditorSystem contribution={data.contribution} />