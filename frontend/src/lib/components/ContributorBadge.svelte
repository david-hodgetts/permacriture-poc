<script lang="ts">
	import { BadgeSize } from "$lib/components-utils/Badge";

    export let color="#ffffff";
    export let text = "";
    export let size:BadgeSize = BadgeSize.Big;

    let sizePx = (size == BadgeSize.Big ? 37 : 22);

    let fontSize = (size == BadgeSize.Big ? 15 : 10);
 

</script>

<div 
    class="badge"
    class:small={size == BadgeSize.Small} 
    style="background-color: {color}; width: {sizePx}px; height: {sizePx}px;"
>
    <div 
        class="text"
        style="font-size: {fontSize}px;"
    >
        {text.toUpperCase()}
    </div>
</div>

<style>
    .badge{
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0px 3px 6px #00000029);
    }    

    .text{
        font-family: Luminari;
        color: white;
    }
</style>