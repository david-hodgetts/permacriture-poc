<script lang="ts">
    import QuillIcon from "$lib/icons/QuillIcon.svelte";
    import MapNavIcon from "$lib/icons/MapNavIcon.svelte";
    import { page } from "$app/stores";
    import { createEventDispatcher } from "svelte";

    $: isJournalSelected = $page.url.pathname === '/';

</script>

<div class="row">
    <a href="/" class:link-inactive={isJournalSelected}>
        <div class="capsule capsule-left" 
            class:selected={isJournalSelected} 
            >
                    <div class="text no-select">
                        journal
                    </div>
                    <QuillIcon selected={isJournalSelected} />
        </div>
    </a>
    <a href="/map" class:link-inactive={!isJournalSelected}>
        <div 
            class="capsule" 
            class:selected={!isJournalSelected}
            >
                <div class="text no-select">
                    carte
                </div>
                <MapNavIcon selected={!isJournalSelected}/>
        </div>
    </a>
</div>

<style>

    .link-inactive{
        pointer-events: none;
    }

    .row{
        margin-top: 23px;
        display: flex;
        justify-content: center;
        /* color: var(--color-text-default); */
        gap: 6px;
    }

    .capsule{
        width:97px;
        height: 38px;
        background-color: var(--color-background-default);
        color: var(--color-text-default);
        display: flex;

        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;

        box-shadow: #54599012 0px 0px 10px 10px;
        border-radius: 9px;
        cursor: pointer;
    }

    .capsule-left{
        gap: 5px
    }

    .selected{
        background-color: var(--color-background-accent);
        color: var(--color-text-selected);
        text-decoration: underline;
        cursor: auto;
    }

    .text{
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        font-size: 16px;
    }

    .capsule-left .text{
        padding-left: 8px;
    }

    a{
        text-decoration: none;
    }

</style>