<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import type { id } from "$lib/models/Id";
	import { hashStr, truncate } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";

    export let maxHeight:string = ""
    export let showTotalParentCount = false;
    export let showTotalChildrenCount = false;
    
    const dispatch = createEventDispatcher();

    export let contribution: Contribution;


    function onClick(){
        dispatch('contributionSelectionRequest', { contributionId: contribution.id });
    }
</script>

<div 
    class="button no-select" 
    style="max-height:{maxHeight}"
    on:click|stopPropagation={onClick}
    on:keydown={() =>{}}
>
    <div class="content">
        <h2 style="background-color:{contribution.color}" class="no-select">{contribution.title}</h2>
    
        <div class="small-text no-select">{truncate(contribution.text, 80)}</div>
    </div>
    {#if showTotalParentCount}
        <div class="parent-count no-select">{contribution.totalCountOfParents}</div>
    {/if}
    {#if showTotalChildrenCount}
        <div class="children-count no-select">{contribution.totalCountOfChildren}</div>
    {/if}
</div>

<style>
    .button{
        position:relative;
        width: 140px;
        height: 100%;
        border-radius: 20px;
        background-color: var(--color-grey-0);
        color: var(--color-grey-1);
        cursor: pointer;
        pointer-events: all;
    }

    .content{
        padding-left: 10px;
        padding-right: 10px;
    }
    
    h2{
        color: white;
        margin: 0;
        border-radius: 20px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .small-text{
        font-size: var(--font-size-super-small);
    }

    .parent-count{
        position: absolute;
        top: 0;
        right: -20px;
    }
    .children-count{
        position: absolute;
        bottom: 0;
        right: -20px;
    }
</style>