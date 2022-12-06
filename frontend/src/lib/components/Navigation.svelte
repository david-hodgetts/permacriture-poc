<script lang="ts">
    import LoginStatus from "./LoginStatus.svelte";
    import { page } from "$app/stores";
	import { onMount } from "svelte";

    onMount(() => console.log($page.url.pathname));
</script>

<nav>
    <LoginStatus />
    <ul>
        <li>
            <a 
            href="/pending" 
            class:active={$page.url.pathname.startsWith('/editor/') || $page.url.pathname === 'pending'}>
                écrire
            </a>
        </li>
        <li><a href="/" class:active={$page.url.pathname === "/"}>textes</a></li>
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

    a{
        text-decoration: none;
        color: var(--color-white)
    }

    .active{
        text-decoration: underline;
    }

    ul{
        display: flex;
        justify-content: space-between;
        width: 80%;
        margin-top: 5px;
        margin-bottom: 5px;
        list-style-type: none;
    }


</style>