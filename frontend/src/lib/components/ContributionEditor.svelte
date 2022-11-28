<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import { produceDateString, produceTimeString } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";
    
    export let contribution: Contribution;

    const dispatch = createEventDispatcher();

    function sendCloseRequest(){
        dispatch("closeRequest", {});
    }

</script>


<div class="modal-close" on:click={sendCloseRequest}></div>
<div class="contribution-editor">
    <header>
        {#if contribution.author != null}
            <h2>contribution.author</h2>
        {:else}
            <h2>&nbsp</h2>
        {/if}
        <div class="date-time">
            <span>{produceDateString(contribution.publicationDatetime)}</span>
            <span>{produceTimeString(contribution.publicationDatetime)}</span>
        </div> 
    </header>
    <div class="text">
        {@html contribution.text }
    </div>
</div>

<style>
    .modal-close{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

    }
    .contribution-editor{
        position:fixed;
        top: 25%;
        left: 0;
        height: 50%;
        background-color: var(--color-grey-0);
        border-radius: 20px;
        color: var(--color-grey-1);
        padding-left: 16.5px;
        padding-right: 16.5px;
        font-size: var(--font-size);
    }
    
    header{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    
    h2{
        margin: 0;
        padding: 0;
    }

    .text{
        margin-top: 20px;
        margin-bottom: 20px;
        height: 70%;
        overflow-y: scroll;
    }

    .date-time{
        font-size: var(--font-size-small);
    }

</style>