<script lang="ts">
	import { goto } from "$app/navigation";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let contribution:Contribution;

    const classFromRole = contribution.isGraine ? "graine" : 
        (contribution.state === ContributionState.Published ? "published" : "editing")  
</script>


<div class={`footer no-select ${classFromRole}`}>
    {#if contribution.state == ContributionState.Editing}
    <div 
        on:click|stopPropagation={() => goto(`/editor/${contribution.id}`)}
        on:keydown={() => null}
        role="button" 
        tabindex=0>… modifier</div>
    {/if}
    <div
        on:click|stopPropagation={() => dispatch("showDetailRequest", {id: contribution.id})} 
        on:keydown={() => null}
        role="button" 
        tabindex=0>… ouvrir</div>

</div>


<style>
    .footer{
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        margin-bottom: 0;
        margin-top: auto;
        padding-bottom: 15px;
        display: flex;
        gap: 20px;
    }
    .editing, .published{
        color: var(--color-text-default);
    }
    .graine{
        color: var(--color-text-selected);
    }
</style>
