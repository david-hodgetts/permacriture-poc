<script lang=ts>
    import LinkToMeIcon from "../LinkToMeIcon.svelte";
    import tippyAction  from '$lib/actions/tippyAction'
    export let isGraine:boolean;

</script>

<div use:tippyAction={{content:"se lier à ce texte", touch:false}} class="link-to-contribution no-select" on:click|stopPropagation on:keydown={() => null} role="button" tabindex=0>
    <LinkToMeIcon isGraine={isGraine} />
    <div class="text" class:graine={isGraine}>perlier</div>
</div>
    
<style>
    .link-to-contribution{
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-left: auto; /* forces right align */
        cursor: pointer;
    }
    .text{
        color: var(--color-text-selected);
        font-size:18px;
        font-weight: bold;
        padding-left: 10px;
        position: relative;
        top: -2px;
    }

    .graine{
        color: var(--color-background-accent);
    }
</style>
