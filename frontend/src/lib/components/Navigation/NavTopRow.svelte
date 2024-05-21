<script lang="ts">
    import JournalIcon from "$lib/icons/JournalIcon.svelte";
    import MapNavIcon from "$lib/icons/MapNavIcon.svelte";
    import { page } from "$app/stores";

    const { terrainSlug } = $page.params;

    $: pathnameWithoutQueryParams = $page.url.pathname.replace(/(\?.+)$/, "");
    $: isJournalSelected = pathnameWithoutQueryParams == `/terrain/${terrainSlug}` || 
        pathnameWithoutQueryParams == `/terrain/${terrainSlug}/`;
    $: isMapSelected = pathnameWithoutQueryParams.startsWith(`/terrain/${terrainSlug}/map`);


</script>

<div class="row">
    <a href={`/terrain/${terrainSlug}`} >
        <div class="capsule capsule-left generic-box-shadow" 
            class:selected={isJournalSelected} 
            >
                <div class="text no-select">
                    journal
                </div>
                <JournalIcon selected={isJournalSelected} />
        </div>
    </a>
    <a href={`/terrain/${terrainSlug}/map`} >
        <div 
            class="capsule generic-box-shadow" 
            class:selected={isMapSelected}
            >
                <div class="text no-select">
                    carte
                </div>
                <MapNavIcon selected={isMapSelected}/>
        </div>
    </a>
</div>

<style>
    .row{
        margin-top: 23px;
        display: flex;
        justify-content: center;
        gap: 6px;
    }

    .capsule{
        width: 97px;
        height: 38px;
        background-color: var(--color-background-default);
        color: var(--color-text-default);
        display: flex;
        pointer-events: auto;

        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;

        /* box-shadow: #54599012 0px 0px 10px 10px; */
        border-radius: 9px;
        cursor: pointer;
    }

    .capsule-left{
        justify-content: start;
        width: 100px;
        gap: 5px
    }

    .selected{
        background-color: var(--color-background-accent);
        color: var(--color-text-selected);
        text-decoration: underline;
    }

    .text{
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