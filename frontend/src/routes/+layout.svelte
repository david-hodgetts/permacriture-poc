<script>
    import Notifications from 'svelte-notifications';
    import Navigation from "$lib/new-components/Navigation.svelte";
    import "../style/app.scss";
    import { page } from "$app/stores";

    $: isMapPage = $page.url.pathname.startsWith("/map") ;

</script>

<Notifications>
    <Navigation />
    <main class:map-page={isMapPage}>
        <slot></slot>
    </main>
</Notifications>


<style lang="scss">
    main{
        margin-top: var(--navbar-height);
        height: 100vh;
        width: 100%;
        max-width: var(--app-max-width);
        margin-left: var(--app-col-margin);
        margin-right: var(--app-col-margin);
    }

    .map-page{
        margin-top: var(--navbar-height-map);
    }

</style>