<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
    import NavDot from "$lib/icons/NavDot.svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    export let contribution: Contribution;

    let strippedText = contribution ? contribution.text.replace(/(<([^>]+)>)/gi, "") : "";
    let selected = false;

    function onClick(){
        selected = ! selected;
        dispatch("selectChange", { contributionId: contribution.id, selected: selected });
    }
</script>

<div class="checkbox" on:click={onClick} on:keydown={() => null} role="button" tabindex=0 >
    <NavDot isSelected={selected}/>
    <ContributorBadge 
        text={contribution.badgeText} 
        backgroundColor={contribution.isGraine ? "#445566" : contribution.color}
        role={BadgeRole.Map}
        />
    <div class="text">{@html strippedText}</div>
</div>

<style>
    .checkbox{
        display: flex;
        width: 100%;
        gap: 20px;
        align-items: center;
    }

    .text{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 70%;
        color: var(--color-text-faded);
        text-align: left;
    }
</style>