<script lang="ts">
    import LinkModal from "./LinkModal.svelte";
    import NewContributionModal from "./NewContributionModal.svelte";
    import DialogModal from "./DialogModal.svelte";
    import { goto, invalidate, invalidateAll } from "$app/navigation";
    import type { Contribution } from "$lib/models/Contribution";
    import { displayStringForState } from "$lib/models/Contribution";
    import { ContributionState } from "$lib/models/Contribution";
    import { strapiService } from "$lib/services/StrapiService";
    import { truncate, produceDateString, produceTimeString } from "$lib/services/textUtils";
    import { createEventDispatcher } from "svelte";

    import Config from "$lib/services/Config";

    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    export let contribution: Contribution;
    export let isFocused: boolean = false;

    const dispatch = createEventDispatcher();

    const maxCharCount = 180;

    let showLinkModal = false;

    let showAbandonDialogModal = false;
    
    // new contribution state
    let showNewContributionModal = false;
    let newContributionParentContribution: Contribution | null = null;

    function sendSelectionRequest(){
        dispatch("cardSelectionRequest", { contributionId: contribution.id });
    }

    async function handlePublicationRequest(){
        try{
            await strapiService.publishContribution(contribution);
            contribution.publicationDatetime = new Date();
            contribution.state = ContributionState.Published;
        }catch(e){
            console.error(e);
            addNotification({
                text: "unable to publish contribution",
                position: "top-center",
                type: "error",
                removeAfter: Config.notificationDuration,
            });
        }
    }

    async function requestAbandonContribution(){
        showAbandonDialogModal = true;
    }

    async function handleAbandonRequest(){
        showAbandonDialogModal = false;
        try{
            await strapiService.abandonContribution(contribution);
            contribution.publicationDatetime = null;
            contribution.state = ContributionState.Abandoned;
        }catch(e){
            console.error(e);
            addNotification({
                text: "unable to abandon contribution",
                position: "top-center",
                type: "error",
                removeAfter: Config.notificationDuration,
            });
        }
    }
    
    function onNewContributionModalCloseRequest(){
        showNewContributionModal = false;
        newContributionParentContribution = null;
    }

    async function requestNewContribution(){
        newContributionParentContribution = contribution;
        showNewContributionModal = true;
    }

    async function createNewContribution(){
        const parentContribution = newContributionParentContribution!;
        const newContributionId = await strapiService.createNewContributionFromParent(parentContribution);
        console.log("new contribution id", newContributionId);
        if(newContributionId === -1){
            console.error("unable to create new contribution");

            addNotification({
                text: "unable to create new contribution",
                position: "top-center",
                type: "error",
                removeAfter: Config.notificationDuration,
            });
            return;
        }
        
        showNewContributionModal = false;
        newContributionParentContribution = null;

        // open the editor 
        goto(`/editor/${newContributionId}`);
    }

    async function onLinkModalCloseRequest(e:any){
        const invalidationRequired = !!e.detail.invalidationRequired;
        if(invalidationRequired){
            // TODO: forces state refresh. We should think about a better state management strategy
            console.log("invalidating route");
            await invalidateAll();
            console.log("invalidation complete");
        }
        showLinkModal = false;
    }
</script>

<LinkModal 
    contribution={contribution} 
    visible={showLinkModal} 
    on:close={onLinkModalCloseRequest}
/>

<NewContributionModal 
    visible={showNewContributionModal}
    parentContribution={newContributionParentContribution}
    on:ok={createNewContribution}
    on:close={onNewContributionModalCloseRequest}
    on:cancel={onNewContributionModalCloseRequest}
/>

<!-- abandon contribution dialog -->
<DialogModal
    visible={showAbandonDialogModal}
    content={{
        text: "êtes-vous sûr de vouloir abandonner cette contribution?",
        optionA: "oui je suis sûr",
        optionB: "non je souhaite garder cette contributiuon",
    }}
    on:optionA={handleAbandonRequest}
    on:optionB={() => showAbandonDialogModal = false }
/>

<div 
    class="contribution-card" 
    class:focused={isFocused}
    class:isMine={contribution.isMine}
    on:click|stopPropagation={sendSelectionRequest}
    on:keydown={() => "silence aly warning"}
>
    <div class="content" >
        <header>
            <h2>{contribution.title} <div class="small-text">(db-id:{contribution.id})</div></h2>
            <div class="small-text">{displayStringForState(contribution.state)}</div>
            {#if contribution.state === ContributionState.Editing}
            <div>
                <span>
                    {`publié dans ${contribution.remainingTimeBeforePublication}`}
                </span>
                <!-- <button on:click|stopPropagation={handlePublicationCancelRequest}>cancel</button> -->
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
                {@html truncate(contribution.textHtml, maxCharCount)}
            {:else}
                {@html contribution.textHtml}
            {/if}
        </div>
    </div>
    <footer>
        {#if !isFocused}
            <div class="open-detail">&hellip; voir plus</div>
        {/if}
        {#if contribution.state === ContributionState.Published}
            <button on:click|stopPropagation={requestNewContribution}>nouvelle contribution</button>
        {:else if contribution.state === ContributionState.Editing }
            <button on:click|stopPropagation={() => goto(`/editor/${contribution.id}`)}>éditer</button>
            <button on:click|stopPropagation={() => showLinkModal = true}>lier à une contribution existante</button>
            {#if contribution.isPublishable}
                <button on:click|stopPropagation={handlePublicationRequest}>publier maintenant</button>
            {/if}
            <button on:click|stopPropagation={requestAbandonContribution}>abandonner</button>
        {/if}

        <div>{contribution.parents.length} | {contribution.children.length}</div>
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
        
        display: flex;
        flex-direction: column;
    }

    .isMine{
        background-color: var(--color-grey-0);
    }
    
    .focused{
        flex-grow: 3;
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



