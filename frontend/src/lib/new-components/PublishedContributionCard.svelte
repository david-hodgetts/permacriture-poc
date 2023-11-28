<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import CardBackground from "./CardBackground.svelte";

    // export let contribution: Contribution;
</script>

<div class="published-card">

    <div class="link-to-contribution">
        <img src="/images/linkToMe.svg" alt="">
        <div class="text">se lier à mon texte</div>
    </div>
    <CardBackground height={289}/>
</div>


<style>
    .published-card{
        width: 100%;
    }
    .link-to-contribution{
        display: flex;
        justify-content: center;
        gap: 5px;
    }
    .link-to-contribution > img{
        width: 42px;
        height: 35px;
    }
    .text{
        color: var(--color-secondary);
        font-size:18px;
        font-weight: bold;
    }
</style>