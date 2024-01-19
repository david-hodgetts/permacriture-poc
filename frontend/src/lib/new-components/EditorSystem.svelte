<script lang=ts>
    import Editor from "./Editor.svelte";
    import Header from "./ContributionCard/Header.svelte";
    import DialogModal from "./Modals/DialogModal.svelte";
    import EsperlinkModal from "./Modals/EsperlinkModal.svelte";
	import type { Contribution } from "$lib/models/Contribution";
	import ButtonSmall from "./ButtonSmall.svelte";

    export let contribution: Contribution;
    
    let showEsperlinkDialog = false;
    let showPubliForceDialog = false;
    let showAbandonDialog = false;

    function onTextChange(e:any){
        console.log("on text change", e.detail.text);
        contribution.text = e.detail.text
    }

    function handleForcePublication(){
        //TODO implement
        showPubliForceDialog = false;
    }

    function handleAbandonRequest(){
        //TODO implement
        showAbandonDialog = false;
    }
    
    async function onEsperlinkModalCloseRequest(e:any){
        // const invalidationRequired = !!e.detail.invalidationRequired;
        // if(invalidationRequired){
        //     // TODO: forces state refresh. We should think about a better state management strategy
        //     console.log("invalidating route");
        //     await invalidateAll();
        //     console.log("invalidation complete");
        // }
        showEsperlinkDialog = false;
    }
</script>


<EsperlinkModal
    visible={showEsperlinkDialog}
    contribution={contribution}
    on:close={onEsperlinkModalCloseRequest}
/>

<DialogModal
    title="Voulez-vous forcer la publication ?"
    subTitle="ce texte sera publié immédiatement"
    visible={showPubliForceDialog} 
    on:close={() => showPubliForceDialog = false}
    on:dialogAccepted={handleForcePublication}
/>

<DialogModal
    title="Voulez-vous abandonner le texte en cours ?"
    subTitle="ce texte sera définitivement supprimé"
    visible={showAbandonDialog} 
    role="danger"
    on:close={() => showAbandonDialog = false}
    on:dialogAccepted={handleAbandonRequest}
/>

<div class="editor-system">
    <Header contribution={contribution} />
    <Editor 
        placeholder="éditez votre contribution" 
        text={contribution.text}
        on:textchange={onTextChange}
    />
    <div class="footer">
        <div class="first-button">
            <ButtonSmall>sauver</ButtonSmall>
        </div>

        <ButtonSmall 
            on:click={() => showEsperlinkDialog = true}>
            esperlier
        </ButtonSmall>
        <ButtonSmall 
            on:click={() => showPubliForceDialog = true}
            disabled={true}>
            publiforcer
        </ButtonSmall>
        <ButtonSmall 
            inverse={true}
            on:click={()=> showAbandonDialog = true}>
            abondonner
        </ButtonSmall>
    </div>
</div>


<style>
    .editor-system{
        width: 100%;
        height: calc(100svh - 180px);
        display:flex;
        flex-direction: column;
        background-color: var(--color-background-default);
        border-radius: 16px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top:15px;
        padding-bottom:15px;

        overflow-y: scroll;
    }

    .footer{
        display: flex;
        justify-content: end;
        gap: 9px;
    }

    .first-button{
        margin-right:auto;
        margin-left: 0;
    }
</style>
