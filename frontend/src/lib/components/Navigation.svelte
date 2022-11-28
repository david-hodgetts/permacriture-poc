<script lang="ts">
    import LoginStatus from "./LoginStatus.svelte";
</script>

<nav>
    <LoginStatus />
    <ul>
        <li>écrire</li>
        <li>textes</li>
        <li>carte</li>
    </ul>
</nav>


<style lang="scss">
    nav{
        position:fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--navbar-height);
        background-color: var(--color-black);
        color: var(--color-white);
    }

    ul{
        display: flex;
        justify-content: space-between;
        width: 80%;
        margin-top: 5px;
        margin-bottom: 5px;
    }

</style>