<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import type { id } from "$lib/models/Id";
	import { hashStr, truncate } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";

    export let maxHeight:string = ""
    
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
>
    <div class="content">
        <h2 style="background-color:{contribution.color}" class="no-select">{contribution.title}</h2>
    
        <div class="small-text no-select">{truncate(contribution.text, 80)}</div>
    </div>
</div>

<style>
    .button{
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
</style>