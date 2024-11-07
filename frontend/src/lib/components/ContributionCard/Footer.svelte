<script lang="ts">
	import { goto } from "$app/navigation";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
    import {createEventDispatcher} from "svelte";
    import { page } from "$app/stores";
    import tippy from "$lib/actions/tippyAction";

    const dispatch = createEventDispatcher();
    const { terrainSlug } = $page.params;

    export let contribution:Contribution;
    export let isInDetailCard = false;

    const classFromRole = contribution.isGraine ? "graine" : 
        (contribution.state === ContributionState.Published ? "published" : "editing")  
</script>


<div class={`footer no-select ${classFromRole}`}>
    {#if contribution.state == ContributionState.Editing}
    <div 
        on:click|stopPropagation={() => goto(`/terrain/${terrainSlug}/editor/${contribution.id}`)}
        on:keydown={() => null}
        role="button" 
        use:tippy={{content:"reprendre et continuer l’écriture de son texte"}}
        tabindex=0>… modifier</div>
    {/if}

    {#if !isInDetailCard}
    <div
        on:click|stopPropagation={() => dispatch("showDetailRequest", {id: contribution.id})} 
        on:keydown={() => null}
        role="button" 
        use:tippy={{content:"lire le texte"}}
        tabindex=0>… ouvrir</div>
    {/if}
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
