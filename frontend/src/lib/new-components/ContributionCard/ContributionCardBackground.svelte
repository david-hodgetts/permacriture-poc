<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";

   export let contribution: Contribution;
   export let height: number; 
</script>

<div class="card" style={`height:${height}px`}>
    <slot></slot>
</div>


<style>
    .card{
        width: 100%;
        background-color: var(--color-secondary);
        border-radius: 16px;
    }
</style>