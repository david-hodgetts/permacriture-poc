<script lang="ts">
	import type Author from "$lib/models/Author";
    import { stringToColor } from "$lib/services/textUtils"; 


    export let authors: Author[];
</script>


<div class="container">
    {#each authors as author}
        <div class="author">
            <div 
            class="color-swatch" 
            style="background-color:{stringToColor(author.nickname)}"></div>
            <div>{author.nickname}</div>
        </div>
    {/each}
</div>


<style>
    .container{
        position: fixed;
        display: flex;
        flex-direction: column;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.5f);
        width: 200px;
    }

    .color-swatch{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }

    .author{
        display: flex;
        gap: 10px;
        padding-bottom: 20px;
    }
</style>