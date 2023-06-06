<script lang="ts">
    import LoginStatus from "./LoginStatus.svelte";
    import { page } from "$app/stores";

    // $: { console.log("page.url", $page.url) }

    let mapHref = "/map";
    $: {
        const contributionId = extractContributionId($page.url.pathname);
        if(contributionId){
           mapHref = `/map/${contributionId}`;
        }
    }

    function extractContributionId(pathname: string): string | null{
        const re = /\/contribution\/(\d+)/;
        const match = pathname.match(re);
        if(match){
            return match[1];
        }
        return null;
    }
</script>

<nav>
    <LoginStatus />
    <ul>
        <li>
            <a href="/" class:active={$page.url.pathname === "/"}>
            textes
            </a>
        </li>
        <li>
            <a href={mapHref} class:active={$page.url.pathname === "/map" }>
                carte
            </a>
        </li>
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