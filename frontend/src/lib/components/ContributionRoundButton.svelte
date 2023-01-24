<script lang="ts">
	import type { id } from "$lib/models/Id";
	import { hashStr } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    export let id: id;
    export let nickname: string|null;
    export let title:string;

    $: backgroundColor = color();

    // set button bg color from hash of author's nickname
    function color(){
        if(!nickname){
            return "#00ff00";
        }

        const toHex = (num: number) => num.toString(16).padStart(2, '0');

        const hash = hashStr(nickname);
        const inDomain = hash % Math.pow(2, 24);
        const red = inDomain & 0xff;
        const green = (inDomain >> 8) & 0xff;
        const blue = (inDomain >> 16) & 0xff;
        return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    }

    function onClick(){
        dispatch('click', { contributionId: id });
    }
</script>

<div 
    class="button no-select" 
    style:background-color={backgroundColor}
    on:click|stopPropagation={onClick}
>{title}</div>

<style>
    .button{
        width: 40px;
        height: 40px;
        border-radius: 40px;
        color: var(--color-black);
        text-align: center;
        padding-top: 10px;
        cursor: pointer;
        pointer-events: all;
    }
</style>