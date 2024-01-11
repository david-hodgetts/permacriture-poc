<script lang="ts">
    import Header from "./Header.svelte";
	import type { Contribution } from "$lib/models/Contribution";

   export let contribution: Contribution;
   export let height: number; 
</script>

<div class="card" style={`height:${height}px`}>
    <Header contribution={contribution} />
</div>


<style>
    .card{
        width: 100%;
        background-color: var(--color-secondary);
        border-radius: 16px;
    }
</style>