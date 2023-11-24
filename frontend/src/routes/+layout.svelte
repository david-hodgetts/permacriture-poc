<script>
// does not seem to work as intended...
// export const csr = false;
// export const prerender = true;
// export const ssr = false;
import Notifications from 'svelte-notifications';
import Navigation from "$lib/components/Navigation.svelte";
import "../style/app.scss";
</script>

<!-- <Notifications>
    <Navigation />
    <main>
        <slot></slot>
    </main>
</Notifications> -->

<slot></slot>

<style lang="scss">
    main{
        margin-top: var(--navbar-height);
        height: 100vh;
    }
</style>