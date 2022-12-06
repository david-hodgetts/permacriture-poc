<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import type { PageData } from "./$types";
    import Editor from "$lib/components/Editor.svelte";

    export let data: PageData;

    function saveText(){
        console.log("save Text");
    }
</script>


<!-- dom -->


<div class="editor">
    <Editor 
        text={data.contribution.text}
    />
    <button on:click={saveText}>save</button>
</div>


<!-- style -->

<style lang="scss">
    .editor{
        width: 100%;
        height: calc(90vh - var(--navbar-height));
    }
</style>