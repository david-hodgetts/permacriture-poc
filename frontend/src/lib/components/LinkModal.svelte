<script lang="ts">
    import Modal from "./Modal.svelte";
    import VerticalContributionMiniList from "./VerticalContributionMiniList.svelte";
	import { goto } from "$app/navigation";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
	import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher();

    export let visible = false;

    export let contribution: Contribution;

    $:{
        if (visible){
            state = State.SelectLinkType;
            contributions = [];
        }
    }

    enum State { SelectLinkType, SelectSecondaryLink }
    let state = State.SelectLinkType;

    let contributions: Contribution[] = [];

    // get all published contributions except this one
    // and all its parent
    async function getContributions(): Promise<Contribution[]>{
        return (await strapiService.getContributions()).filter(c => {
            return  c.state == ContributionState.Published &&
                    c.id != contribution.id && true &&
                    !contribution.parents.includes(c.id);
        });
    }

    async function handleShowSecondaryLinkSelector(){
        state = State.SelectSecondaryLink;
        contributions = await getContributions();
    }

    async function createNewContribution(){

        const parentContribution = contribution;
        const newContributionId = await strapiService.createNewContributionFromParent(parentContribution);
        console.log("new contribution id", newContributionId);
        if(newContributionId === -1){
            // TODO: handle error for user
            console.error("unable to create new contribution");
            return;
        }


        // open the editor 
        goto(`/editor/${newContributionId}`);
    }
    
    async function requestSecondaryLinkCreation(e:any){
        const requestedContributionParentId = e.detail.contributionId;
        console.log("requestion link to contribution", requestedContributionParentId);

        const newLinkId = await strapiService.addParentToContribution(contribution, requestedContributionParentId);
        if(newLinkId === -1){
            // TODO: handle error for user
            console.error("unable to create new parent link");
            return;
        }


        // operation was succesful
        console.log("add link operation successful");
        
        // close modal
        dispatch("close", {invalidationRequired:true});
    }
</script>



<Modal visible={visible} on:close>
    <h2>lier</h2>
    {#if state === State.SelectLinkType}
        <button on:click={createNewContribution}>nouvelle contribution</button>
        <button on:click={handleShowSecondaryLinkSelector}>lier à une contribution existante</button>
    {:else}
        <div class="second-panel">
            <h3>contrib selector</h3>
            {#if contributions.length > 0}
                <VerticalContributionMiniList
                    on:contributionSelectionRequest={requestSecondaryLinkCreation}
                    contributions={contributions}/>
            {:else}
                <div>Cette contribution n'a pas de candidat auquel se rattacher</div>
            {/if}
        </div>
    {/if}

</Modal>


<style>
    .second-panel{
        height: 70%;
    }
</style>


