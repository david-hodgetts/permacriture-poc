<script lang="ts">
    import NavDot from "$lib/icons/NavDot.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    export let isPublished = true; 
</script>

<div class="row">
    <div class="capsule">
        <div class="item left" class:selected={isPublished}>
            <NavDot isSelected={isPublished} />
            <div>tous les textes</div>
        </div>
        <div class="item right" class:selected={!isPublished}>
            <NavDot isSelected={!isPublished} />
            <div>mes textes</div>
        </div>
    </div>
</div>

<style>

    .row{
        display: flex;
        justify-content: center;
        color: var(--color-primary);
        gap: 6px;
    }

    .capsule{
        width: 316px;
        height: 43px;
        background-color: var(--color-background-default);
        color: var(--color-text-default);
        border-radius: 43px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5px;

        font-size: 17px;
        font-weight: 500;
    }

    .selected{
        font-weight: bold;
    }

    .left{
        padding-left: 12px;
    }

    .right{
        padding-right: 17px;
    }

</style>