<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Contribution } from "$lib/models/Contribution";
	import { ContributionState } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
    import { truncate, produceDateString, produceTimeString } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";
	import { children } from "svelte/internal";
	import ContributionList from "./ContributionList.svelte";

    export let contribution: Contribution;
    export let isFocused: boolean = false;

    const dispatch = createEventDispatcher();

    const maxCharCount = 180;

    function sendSelectionRequest(){
        dispatch("cardSelectionRequest", { contribution: contribution });
    }

    function sendNewContributionRequest(){
        dispatch("newContributionRequest", { contribution: contribution });
    }
    
    function sendCloseRequest(){
        dispatch("closeRequest", {});
    }

    async function handlePublicationRequest(){
        try{
            await strapiService.publishContribution(contribution);
            contribution.publicationDatetime = new Date();
            contribution.state = ContributionState.PendingPublication;
        }catch(e){
            console.error(e);
        }
    }

    async function handlePublicationCancelRequest(){
        try{
            await strapiService.cancelPublication(contribution);
            contribution.publicationDatetime = null;
            contribution.state = ContributionState.Editing;
        }catch(e){
            console.error(e);
        }
    }

    async function handleAbandonRequest(){
        try{
            await strapiService.abandonContribution(contribution);
            contribution.publicationDatetime = null;
            contribution.state = ContributionState.Abandoned;
        }catch(e){
            console.error(e);
        }

    }
</script>

{#if isFocused}
    <div class="modal-close" on:click={sendCloseRequest}></div>
{/if}
<div 
    class="contribution-card" 
    class:focused={isFocused}
    class:isMine={contribution.isMine}
    on:click|stopPropagation={sendSelectionRequest}
>
    <div class="content" >
        <header>
            {#if contribution.author != null}
                <h2>{contribution.author.nickname}</h2>
            {:else}
                <h2>&nbsp</h2>
            {/if}
            <div class="small-text">{contribution.state}</div>
            {#if contribution.state === ContributionState.PendingPublication}
            <div>
                <span>
                    {`published in ${contribution.delayInMinutesBeforePublication} minutes`}
                </span>
                <button on:click={handlePublicationCancelRequest}>cancel</button>
            </div>
            {:else if contribution.state === ContributionState.Published}
                <div class="date-time">
                    <span>{produceDateString(contribution.publicationDatetime)}</span>
                    <span>{produceTimeString(contribution.publicationDatetime)}</span>
                </div> 
            {/if}
        </header>
        <div class="text">
            {#if !isFocused}
                {@html truncate(contribution.text, maxCharCount)}
            {:else}
                {@html contribution.text}
            {/if}
        </div>
    </div>
    <footer>
        {#if !isFocused}
            <div class="open-detail">&hellip; voir plus</div>
        {/if}
        {#if contribution.state === ContributionState.Published}
            <button on:click|stopPropagation={sendNewContributionRequest}>new</button>
        {:else if contribution.state === ContributionState.Editing}
            <button on:click|stopPropagation={() => goto(`/editor/${contribution.id}`)}>edit</button>
            <button on:click|stopPropagation={handlePublicationRequest}>publish</button>
            <button on:click|stopPropagation={handleAbandonRequest}>abandon</button>
        {/if}

        <div>{contribution.parents.length} | {contribution.children.length}</div>
    </footer>
</div>



<style lang="scss">
    .modal-close{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

    }
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
        
        display: flex;
        flex-direction: column;
    }

    .isMine{
        background-color: var(--color-grey-0);
    }
    
    .focused{
        position:fixed;
        top: 25%;
        left: 0;
        width: 100%;
        height: 50%;
    }
    
    .content{
        display: flex;
        flex-direction: column;
        overflow: hidden;
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
        overflow-y: scroll;
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

    .small-text{
        font-size: 12px;
    }

</style>



