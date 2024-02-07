<script lang="ts">
    import LinkToMeIcon from "../LinkToMeIcon.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let count: number;
    export let isGraine:boolean;
    export let isClickable = false;

    function handleClick(){
        if(!isClickable){
            return;
        }

        dispatch("click", {});
    }
</script>

<div class="counter" class:is-clickable={isClickable} on:click={handleClick} on:keydown={()=>null} role="button" tabindex=0>
    <LinkToMeIcon isGraine={isGraine} />
    <div class="count-rect no-select" class:graineRect={isGraine}>
        <div class="count-bg" class:graineBg={isGraine}>
            <div class="num" class:graineText={isGraine}>{count}</div>
        </div>
    </div>
</div>


<style>
    .counter{
        position: relative;
        height: 35px;
        padding-left:65px;
    }
    .is-clickable{
        cursor: pointer;
    }
    .count-rect{
        position:absolute;
        top: -5px;
        right: -5px;
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background-color: var(--color-background-default);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .count-bg{
        position:absolute;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background-color: var(--color-background-accent);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .num{
        font-size: 18px;
        font-weight: bold;
        color: var(--color-text-selected);
    }

    .graineText{
        color: var(--color-background-accent);
    }
    .graineBg{
        background-color: var(--color-text-selected);
    }
    .graineRect{
        background-color: var(--color-background-accent);
    }
</style>