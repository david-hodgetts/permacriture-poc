<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let isTextSelected = true;

    const dispatch = createEventDispatcher();


</script>

<div class="row">
    <div class="capsule capsule-left" 
        class:selected={isTextSelected} 
        on:keypress={() => null}
        on:click={() => dispatch("menu-change", {menu: "text"})}>
        <div class="content">
            <div class="text">
                textes
            </div>
        </div>
    </div>
    <div 
        class="capsule capsule-right" 
        class:selected={!isTextSelected}
        on:keypress={() => null}
        on:click={() => dispatch("menu-change", {menu: "text"})}>
        <div class="content">
            <div class="text">
                carte
            </div>
        </div>
    </div>
</div>

<style>

    .row{
        margin-top: 23px;
        display: flex;
        justify-content: center;
        color: var(--color-primary);
        gap: 16px;
    }

    .capsule{
        width:95px;
        height: 38px;
        background-color: var(--color-secondary);
        color: var(--color-text-disabled);
        display: flex;

        flex-direction: column;
        justify-content: center;

        box-shadow: inset #4208ff09 0px 0px 10px 10px;
        cursor: pointer;
    }

    .capsule .content{
        display: flex;
        justify-content: center;
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
        font-weight: bold;
        text-decoration: underline;
        cursor: auto;
    }
</style>