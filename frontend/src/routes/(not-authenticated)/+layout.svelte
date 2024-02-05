<script>
    import PermaLogo from "$lib/components/PermaLogo.svelte";
</script>

<main>
    <PermaLogo/>
    <slot></slot>
</main>


<style lang="scss">
    main{
        // margin-top: var(--navbar-height);
        // height: calc(100svh - var(--navbar-height));
        margin-top: 40px;
        width: 100%;
        max-width: var(--app-max-width);
        margin-left: var(--app-col-margin);
        margin-right: var(--app-col-margin);
    }
</style>