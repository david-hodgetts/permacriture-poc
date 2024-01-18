<script lang="ts">
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
	import type Author from "$lib/models/Author";
	import { colorForAuthor } from "$lib/models/Author";
    export let author:Author;

    $: color = colorForAuthor(author);

    $: console.log("color", color);
</script>

<div class="element">
    <ContributorBadge text={author.nickname[0]} backgroundColor={color} />
    <p>{author.nickname}</p>
</div>


<style>
    .element{
        display: flex;
        align-items: center;
        gap: 10px;
    }

    p{
        font-size: 18px;
        font-weight: bold;
        color: var(--color-text-default);
        margin: 0;
    }
</style>