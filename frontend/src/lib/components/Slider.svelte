<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let value:number;
    export let min:number;
    export let max:number;
    export let step = 1;
    export let width = "316px";

    let element:HTMLInputElement;

    onMount(()=>{
        console.log("value is ", value, "min", min, "max", max);
        element.addEventListener("input", onInput);
        element.value = value.toString();
    });

    onDestroy(()=>{
        element.removeEventListener("input", onInput);
    });

    function onInput(e:any){
        e.stopPropagation();
        value = e.target.value;
        dispatch("input", { value });
    }

</script>

<div class="slider generic-box-shadow" style="max-width:{width}">
    <div class="controls">
        <div class="text">&minus;</div>
        <input 
            type="range"  
            value={value.toString()}
            min={min.toString()}
            max={max.toString()}
            step={step.toString()}
            bind:this={element}
            />
        <div class="text">&plus;</div>
    </div>
</div>

<style>
    .slider{
        width: 100%;
        height: 43px;
        background-color: var(--color-background-default);
        border-radius: 22px;
        display:flex;
        justify-content: center;
        align-items: center;

        padding-left: 15px;
        padding-right: 15px;
    }

    .controls{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .text{
        position: relative;
        top: -1px;
        font-weight: bold;
        font-size: 17px;
    }

    :root{
        --track-color: var(--color-background-app);
        --track-height: 5px;
        --track-border-radius: 2px;
        --thumb-color: var(--color-text-selected);
        --thumb-outline-color: var(--color-text-default);
        --thumb-radius: 10px;
        --thumb-radius-webkit: calc(var(--thumb-radius) * 1.3);
    }
    /********** Range Input Styles **********/
    /*Range Reset*/
    input[type="range"] {
        -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            width: 15rem;
    }

    /* Removes default focus */
    input[type="range"]:focus {
        outline: none;
    }

    /***** Chrome, Safari, Opera and Edge Chromium styles *****/
    /* slider track */
    input[type="range"]::-webkit-slider-runnable-track {
        background-color: var(--track-color);
        border-radius: var(--track-border-radius);
        height: var(--track-height);  
    }

    /* slider thumb */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        margin-top: -4.7px; /* Centers thumb on the track */

        /*custom styles*/
        background-color: var(--thumb-color);
        height: var(--thumb-radius-webkit);
        width: var(--thumb-radius-webkit);
        border-radius: var(--thumb-radius-webkit);

        border: 1px solid var(--thumb-outline-color);
        outline: 3px solid var(--thumb-outline-color);
    }

    /******** Firefox styles ********/
    /* slider track */
    input[type="range"]::-moz-range-track {
        background-color: var(--track-color);
        border-radius: var(--track-border-radius);
        height: var(--track-height);
    }

    /* slider thumb */
    input[type="range"]::-moz-range-thumb {
        border: none; /*Removes extra border that FF applies*/
        border-radius: 0; /*Removes default border-radius that FF applies*/

        /*custom styles*/
        background-color: var(--thumb-color);
        height: var(--thumb-radius);
        width: var(--thumb-radius);
        border-radius: var(--thumb-radius);
        
        border: 1px solid var(--thumb-outline-color);
        outline: 3px solid var(--thumb-outline-color);
        /* outline: 3px solid var(--thumb-color); */
        /* outline-offset: 0.125rem;  */
    }
</style>