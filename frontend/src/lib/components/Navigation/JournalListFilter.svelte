<script lang="ts">
    import NavDot from "$lib/icons/NavDot.svelte";
    import OrderArrow from "../OrderArrow.svelte";
    import TerrainTitle from "../TerrainTitle.svelte";
    
    import { Filter, Order } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";
    import UserStore from '$lib/stores/user.store';

    export let filter: Filter = Filter.all;
    export let order: Order;

    const dispatch = createEventDispatcher();

    function select(selectedFilter: Filter){
        if(selectedFilter == filter){
            // only change order
            dispatch("orderInvertRequest", {});
            return;
        }

        dispatch("filterChangeRequest", { filter: selectedFilter });
    }
</script>

<div class="element">
    <div class="row no-select">
        <div class="capsule generic-box-shadow" class:notLoggedIn={!$UserStore.user}>
            <div 
                class="item left" 
                class:selected={filter == Filter.all}
                on:click={() => select(Filter.all)}
                on:keydown={() => null}
                role="button"
                tabindex=0
            >
                <NavDot isSelected={filter == Filter.all} />
                <div class="text">tous les textes</div>
                {#if filter == Filter.all}
                    <OrderArrow order={order}/>
                {/if}
            </div>
            {#if $UserStore.user}
                <div 
                    class="item right" 
                    class:selected={filter == Filter.mine}
                    on:click={() => select(Filter.mine)}
                    on:keydown={() => null}
                    role="button"
                    tabindex=0
                >
                    <NavDot isSelected={filter == Filter.mine} />
                    <div class="text">mes textes</div>
                    {#if filter == Filter.mine}
                        <OrderArrow order={order}/>
                    {/if}
                </div>
            {/if}
        </div>
    </div>

    <TerrainTitle/>
</div>

<style>
    .element{
        position: fixed;
        top: var(--navbar-height-map);
        width: 100%;
        left:0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 50;
    }
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
        align-items: center;
        gap: 20px;
    }

    .notLoggedIn{
        width: 200px;
        justify-content: center;
    }

    .item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5px;

        cursor: pointer;

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

    .text{
        color: var(--color-text-default);
    }

</style>