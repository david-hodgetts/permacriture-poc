<script lang="ts">
	import type { id } from "$lib/models/Id";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    export let id: id;
    export let name:string;

    function onClick(){
        dispatch('click', { contributionId: id });
    }
</script>

<div 
    class="button no-select" 
    on:click|stopPropagation={onClick}
>{name}</div>

<style>
    .button{
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background-color: green;
        color: var(--color-white);
        text-align: center;
        padding-top: 10px;
        cursor: pointer;
        pointer-events: all;
    }
</style>