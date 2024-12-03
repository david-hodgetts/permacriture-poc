<script lang=ts>
    import Editor from "./Editor.svelte";
    import Header from "./ContributionCard/Header.svelte";
    import DialogModal from "./Modals/DialogModal.svelte";
    import AlertModal from "./Modals/AlertModal.svelte";
    import EsperlinkModal from "./Modals/EsperlinkModal.svelte";
    import SaveCompletedButton from "./SaveCompletedButton.svelte";
	import ButtonSmall from "./ButtonSmall.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
	import Config from "$lib/services/Config";
    import { getNotificationsContext } from 'svelte-notifications';
	import { beforeNavigate, goto } from "$app/navigation";
	import type { BeforeNavigate } from "@sveltejs/kit";
	import BottomCounter from "./ContributionCard/decoration/BottomCounter.svelte";
	import ParentChildrenLinks from "./ContributionCard/ParentChildrenLinks.svelte";
    import { page } from "$app/stores";

    import { editorAutosaveService } from "$lib/services/EditorAutosaveService";
	import { onDestroy, onMount } from "svelte";
	import { ParentChildrenLinksPosition } from "$lib/models/Misc";
    
    const { addNotification } = getNotificationsContext();

    export let contribution: Contribution;
    
    let showEsperlinkDialog = false;
    let showPubliForceDialog = false;
    let showAbandonDialog = false;
    let showNotPubliforcableAlert = false;
    let notPubliForcableAlertText = "";

    let showReallyLeavePageDialog = false;
    let allowLeavingPage = false;
    let desiredDestination:URL;

    let saveTasksAreComplete = true;

    let invalidationKey = 0;

    let isPublishable = contribution.isPublishable;

    let intervalId:number = -1;

    onMount(() => {
        console.log("allow lea", allowLeavingPage);
        editorAutosaveService.errorCallback = onSaveError;
        editorAutosaveService.autosaveTasksCompletedCallback = onSaveTasksComplete;

        intervalId = setInterval(updatePublishableState, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

    function updatePublishableState(){
        isPublishable = contribution.isPublishable;
    }

    beforeNavigate((navigation: BeforeNavigate) => {
        console.log("leaving for", navigation.to?.url.pathname);
        if(!editorAutosaveService.isUpToDate && !allowLeavingPage){
            desiredDestination = navigation.to?.url as URL;
            showReallyLeavePageDialog = true;
            allowLeavingPage = true;
            navigation.cancel();
        }
    });
     
    function handleLeavePageWithoutSaving(){
        showReallyLeavePageDialog = false;
        if(!desiredDestination){
            const { terrainSlug } = $page.params;
            goto(`/terrain/${terrainSlug}`);
        }else{
            goto(desiredDestination.pathname);
        }
    }

    function onTextChange(e:any){
        // console.log("on text change", e.detail.text);
        contribution.text = e.detail.text;
        editorAutosaveService.addState(structuredClone(contribution));
        saveTasksAreComplete = false;
    }
    
    function onSaveTasksComplete(){
        saveTasksAreComplete = true;
    }

    function onSaveError(e:any){
        addNotification({
            text: e,
            position: 'top-center',
            type: 'error',
            removeAfter: Config.notificationDuration,
        });
    }

    function handleShowNotPubliforcableDialog(){
        // 1. update alert text (compute delay before force publishable)
        const delayInMinutes = contribution.delayInMinutesBeforePubliForcable;
        const hours = Math.floor(delayInMinutes / 60);
        const minutes = delayInMinutes % 60;

        let delayStr = "";;

        if(hours > 0){
            const pluralStr = hours > 1 ? "s" : "";
            delayStr = `${hours} heure${pluralStr} et ${minutes.toString().padStart(2, '0')} minutes`;
        }else{
            delayStr = `${minutes} minutes`;
        }
        
        notPubliForcableAlertText = `Elle le sera uniquement dans ${delayStr}.`;

        // 2. show alert
        showNotPubliforcableAlert = true;
    }

    async function handleForcePublication(){
        showPubliForceDialog = false;
        try{
            await strapiService.publishContribution(contribution);
            contribution.publicationDatetime = new Date();
            contribution.state = ContributionState.Published;
            addNotification({
                text: "contribution publiée avec succés",
                position: "top-center",
                type: "success",
                removeAfter: Config.notificationDuration,
            });
            const { terrainSlug } = $page.params;
            goto(`/terrain/${terrainSlug}`);
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

    async function handleAbandonRequest(){
        console.log("abandon contribution");
        showAbandonDialog = false;
        try{
            await strapiService.abandonContribution(contribution);
            addNotification({
                text: "texte disperlié",
                position: "top-center",
                type: "success",
                removeAfter: Config.notificationDuration,
            });
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
        }finally{
            const { terrainSlug } = $page.params;
            goto(`/terrain/${terrainSlug}/?filter=mes-textes`);
        }
    }
    
    async function onEsperlinkModalCloseRequest(e:any){
        const invalidationRequired = !!e.detail.invalidationRequired;
        if(invalidationRequired){
            // TODO: forces state refresh. We should think about a better state management strategy
            console.log("invalidating route", contribution);
            invalidationKey = invalidationKey + 1;
        }

        showEsperlinkDialog = false;
    }

    function onParentContributionSelectionRequest(e:any){
        const contributionId = e.detail.id;
        const { terrainSlug } = $page.params;
        goto(`/terrain/${terrainSlug}/contribution/${contributionId}`);
    }
</script>

{#key invalidationKey}

<AlertModal
    title="La publication de ce texte ne peut encore être avancée."
    subTitle={notPubliForcableAlertText}
    visible={showNotPubliforcableAlert}
    on:close={() => showNotPubliforcableAlert = false}
/>

<EsperlinkModal
    visible={showEsperlinkDialog}
    contribution={contribution}
    on:close={onEsperlinkModalCloseRequest}
/>

<DialogModal
    title="Voulez-vous avancer la publication ?"
    subTitle="Ce texte sera publié immédiatement"
    visible={showPubliForceDialog} 
    on:close={() => showPubliForceDialog = false}
    on:dialogAccepted={handleForcePublication}
/>

<DialogModal
    title="Abandonnez-vous la publication de ce texte?"
    subTitle="une fois disperlié, ce texte ne pourra plus être publié"
    visible={showAbandonDialog} 
    role="danger"
    on:close={() => showAbandonDialog = false}
    on:dialogAccepted={handleAbandonRequest}
/>

<DialogModal
    title="Voulez-vous vraiment quitter cette page?"
    subTitle="le texte n'a pas été sauvé"
    visible={showReallyLeavePageDialog} 
    role="danger"
    on:close={() => showReallyLeavePageDialog = false}
    on:dialogAccepted={handleLeavePageWithoutSaving}
/>

<div class="editor-system">
    <Header contribution={contribution} />
    <Editor 
        placeholder="rédigez votre texte" 
        text={contribution.text}
        on:textchange={onTextChange}
    />
    <div class="footer">
        <div class="first-button">
            <SaveCompletedButton isDisabled={!saveTasksAreComplete} />
            <!-- {#if !showSavedStatus}
                <SaveButton disabled={!enableSaveTextButton} on:click={save} />
            {:else}
                <SaveCompletedButton />
            {/if} -->
        </div>

        <ButtonSmall 
            on:click={() => showEsperlinkDialog = true}
            tippyContent="se lier à un ou plusieurs autres textes">
            esperlier
        </ButtonSmall>
        {#if isPublishable}
            <ButtonSmall 
                on:click={() => showPubliForceDialog = true}
                tippyContent="accélérer la publication de son texte">
                avancer
            </ButtonSmall>
        {:else}
            <ButtonSmall 
                buttonType="neutral"
                on:click={handleShowNotPubliforcableDialog}
                tippyContent="accélérer la publication de son texte">
                avancer
            </ButtonSmall>
        {/if}
        <ButtonSmall 
            inverse={true}
            on:click={()=> showAbandonDialog = true}
            tippyContent="abandonner la publication de son texte">
            disperlier
        </ButtonSmall>
    </div>
</div>

<div class="bottom-decoration">
    <BottomCounter count={contribution.parents.length}/>
    <ParentChildrenLinks 
        contributionIds={contribution.parents}
        on:contributionSelection={onParentContributionSelectionRequest}
        position={ParentChildrenLinksPosition.BOTTOM}
        heightOffset="5px"/>
</div>

{/key}

<style>
    .editor-system{
        width: 100%;
        height: calc(100svh - 200px);
        display:flex;
        flex-direction: column;
        background-color: var(--color-background-default);
        border-radius: 16px;
        padding-left: 15px;
        padding-right: 15px;
        /* padding-top:15px; */
        padding-bottom:15px;

        margin-top: 30px;

        overflow-y: scroll;
    }

    .footer{
        display: flex;
        justify-content: end;
        align-items: end;
        gap: 9px;
    }

    .first-button{
        margin-right:auto;
        margin-left: 0;
    }

    .bottom-decoration{
        display: flex;
    }
</style>
