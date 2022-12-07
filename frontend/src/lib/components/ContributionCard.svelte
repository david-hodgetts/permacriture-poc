<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import { ContributionState } from "$lib/models/Contribution";
    import { truncate, produceDateString, produceTimeString } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";

    export let contribution: Contribution;

    const dispatch = createEventDispatcher();

    const maxCharCount = 180;

    function sendSelectionRequest(){
        dispatch("cardSelectionRequest", { contribution: contribution });
    }

    function sendNewContributionRequest(){
        dispatch("newContributionRequest", { contribution: contribution });
    }
</script>


<div class="contribution-card" on:click|stopPropagation={sendSelectionRequest}>
    <div class="content" >
        <header>
            {#if contribution.author != null}
                <h2>{contribution.author.nickname}</h2>
            {:else}
                <h2>&nbsp</h2>
            {/if}
            <div class="date-time">
                <span>{produceDateString(contribution.publicationDatetime)}</span>
                <span>{produceTimeString(contribution.publicationDatetime)}</span>
            </div> 
        </header>
        <div class="text">
            {@html truncate(contribution.text, maxCharCount)}
        </div>
    </div>
    <footer>
        <div class="open-detail">
            &hellip; voir plus
        </div>
        {#if contribution.state === ContributionState.Published}
            <button on:click={sendNewContributionRequest}>new</button>
        {/if}
    </footer>
</div>



<style lang="scss">
    .contribution-card{
        background-color: var(--white);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: var(--contribution-card-height);
        border-radius: 20px;
        color: var(--color-grey-1);
        padding-left: 16.5px;
        padding-right: 16.5px;
        font-size: var(--font-size);

        border: solid 1px var(--color-grey-0);
        cursor: pointer;
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
    }

    .date-time{
        font-size: var(--font-size-small);
    }

    footer{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
    }

    .open-detail{
        font-size: var(--font-size-super-small);
        font-weight: bold;
    }

    button{
        cursor: pointer;
    }

</style>



