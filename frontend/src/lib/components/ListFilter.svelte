<script lang="ts">
import { Filter } from "$lib/models/Contribution";
import { createEventDispatcher } from "svelte";

export let filter: Filter = Filter.all;

const dispatch = createEventDispatcher();

function select(selectedFilter: Filter){
    if(selectedFilter == filter){
        // only change order
        dispatch("orderInvertRequest", {});
        return;
    }

    dispatch("filterChangeRequest", { filter: selectedFilter });
}

</script>

<div class="list-filter">
    <span 
        class:active={filter == Filter.all}
        class="button"
        on:click={() => select(Filter.all)}
    >all</span>
    &nbsp;
    <span 
        class:active={filter == Filter.mine}
        class="button"
        on:click={() => select(Filter.mine)}
    >mine</span>
</div>

<style>
    .list-filter{
        position: sticky;
        top: var(--navbar-height);
        background-color: var(--color-white);
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .button{
        cursor: pointer;
    }
    .active{
        font-weight: bold;
    }
</style>