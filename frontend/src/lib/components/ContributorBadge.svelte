<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";

    import tippyAction from "$lib/actions/tippyAction";

    export let backgroundColor="#000";
    export let isGraine = false;
    export let text = "";
    export let role:BadgeRole = BadgeRole.List;

    let sizePx = (role == BadgeRole.List ? 31 : 54);

    let fontSize = (role == BadgeRole.List ? 15 : 25);

</script>

<div 
    class="badge"
    class:small={role == BadgeRole.List} 
    style="background-color: {isGraine ? "#fff" : backgroundColor}; width: {sizePx}px; height: {sizePx}px;"
    use:tippyAction={{content:`${text.toUpperCase()}`}}
>
    <div 
        class="text no-select"
        class:textGraine={isGraine}
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
        /* filter: drop-shadow(0px 3px 6px #00000029); */
    }    

    .text{
        color: var(--color-text-selected);
        font-weight: bold;
        letter-spacing: -1px;
    }

    .textGraine{
        color: var(--color-background-accent);
    }
</style>