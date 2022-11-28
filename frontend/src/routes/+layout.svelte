<script>
// does not seem to work as intended...
// export const csr = false;
// export const prerender = true;
// export const ssr = false;
import Navigation from "$lib/components/Navigation.svelte";
</script>

<Navigation />

<main>
    <slot></slot>
</main>


<style lang="scss">
    main{
        margin-top: var(--navbar-height);
    }
</style>