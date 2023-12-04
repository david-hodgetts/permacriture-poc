<script lang="ts">
    import Modal from "./Modal.svelte";
    import { createEventDispatcher } from "svelte";

    export let visible = false;

    export let content:{
        text:string;
        optionA:string;
        optionB: string;
    };
    const dispatch = createEventDispatcher();


</script>

<Modal visible={visible}>
    <div class="panel">
        <h3>
            {content.text}
        </h3>
        <div class="buttons">
            <button on:click|stopPropagation={() => dispatch('optionA', {})}>{content.optionA}</button>
            <button on:click|stopPropagation={() => dispatch('optionB', {})}>{content.optionB}</button>
        </div>
    </div>
    
</Modal>

<style>
    .panel{
        height: 200px;
    }
</style>