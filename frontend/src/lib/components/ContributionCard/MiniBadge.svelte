<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import tippy from "$lib/actions/tippyAction";

    export let contribution: Contribution;

    $: backgroundColor = contribution.isGraine ? "#525EF5" : contribution.color;
</script>

<div 
    class="badge" 
    use:tippy={{content:'lire un texte lié'}}
    style="background-color: {backgroundColor}" 
    on:click on:keydown={() => null} 
    role="button" 
    tabindex="0">
    <div class="text no-select">
        {contribution.badgeText}
    </div>
</div>

<style>
    .badge{
        width: 32px;
        height: 32px;
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 9px;
        cursor: pointer;
    }

    .text{
        font-size: 14px;
        font-weight: bold;
        color: var(--color-text-selected);
    }

</style>