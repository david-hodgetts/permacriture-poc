<script>
    import Navigation from "$lib/components/Navigation.svelte";
    import { page } from "$app/stores";

    $: doesNotHaveJournalFilter = $page.url.pathname.startsWith("/map") || 
                                  $page.url.pathname.startsWith("/editor") ;

</script>

<Navigation />
<main class:map-page={doesNotHaveJournalFilter}>
    <slot></slot>
</main>


<style lang="scss">
    main{
        margin-top: var(--navbar-height);
        height: calc(100svh - var(--navbar-height));
        width: 100%;
        max-width: var(--app-max-width);
        padding-left: var(--app-col-margin);
        padding-right: var(--app-col-margin);
    }

    .map-page{
        margin-top: var(--navbar-height-map);
        height: calc(100svh - var(--navbar-height-map));
    }
</style>