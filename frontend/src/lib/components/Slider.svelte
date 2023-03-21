<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let value:number;
    export let min:number;
    export let max:number;
    export let step = 1;

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

<input 
    type="range"  
    value={value.toString()}
    min={min.toString()}
    max={max.toString()}
    step={step.toString()}
    bind:this={element}
    />