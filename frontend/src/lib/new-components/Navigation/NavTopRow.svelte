<script lang="ts">
    import QuillIcon from "$lib/icons/QuillIcon.svelte";
    import MapNavIcon from "$lib/icons/MapNavIcon.svelte";
    import { createEventDispatcher } from "svelte";
    export let isTextSelected = true;

    const dispatch = createEventDispatcher();

</script>

<div class="row">
    <div class="capsule capsule-left" 
        class:selected={isTextSelected} 
        on:keypress={() => null}
        on:click={() => dispatch("menu-change", {menu: "text"})}>
            <div class="text">
                textes
            </div>
            <QuillIcon selected={isTextSelected} />
    </div>
    <div 
        class="capsule capsule-right" 
        class:selected={!isTextSelected}
        on:keypress={() => null}
        on:click={() => dispatch("menu-change", {menu: "text"})}>
            <div class="text">
                carte
            </div>
            <MapNavIcon selected={!isTextSelected}/>
    </div>
</div>

<style>

    .row{
        margin-top: 23px;
        display: flex;
        justify-content: center;
        color: var(--color-primary);
        gap: 6px;
    }

    .capsule{
        width:95px;
        height: 38px;
        background-color: var(--color-secondary);
        color: var(--color-text-disabled);
        display: flex;

        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;

        box-shadow: inset #4208ff09 0px 0px 10px 10px;
        cursor: pointer;
    }

    .capsule-left{
        border-radius: 38px 7px 7px 38px; /* top-left | top-right | bottom-right | bottom-left */
    }

    .capsule-right{
        border-radius: 7px 38px 38px 7px; /* top-left | top-right | bottom-right | bottom-left */
    }

    .selected{
        background-color: var(--color-accent);
        color: var(--color-primary);
        text-decoration: underline;
        cursor: auto;
    }

    .text{
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        font-size: 16px;
    }

    .capsule-left .text{
        padding-left: 8px;
    }

    /* .capsule-right .text{
        padding-left: 4px;
    }  */
</style>