<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";

    export let color="#ffffff";
    export let text = "";
    export let role:BadgeRole = BadgeRole.List;

    let sizePx = (role == BadgeRole.List ? 31 : 54);

    let fontSize = (role == BadgeRole.List ? 15 : 25);

</script>

<div 
    class="badge"
    class:small={role == BadgeRole.List} 
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
        border-radius: 9px;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0px 3px 6px #00000029);
    }    

    .text{
        font-weight: bold;
        color: white;
    }
</style>