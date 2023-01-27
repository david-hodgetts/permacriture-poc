<script lang="ts">
    import Modal from "./Modal.svelte";
    import VerticalContributionMiniList from "./VerticalContributionMiniList.svelte";
	import { goto } from "$app/navigation";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
	import { get } from "svelte/store";
    export let visible = false;

    export let contribution: Contribution;

    $:{
        if (visible){
            state = State.SelectLinkType;
        }
    }

    enum State { SelectLinkType, SelectSecondaryLink }
    let state = State.SelectLinkType;

    let contributions: Contribution[] = [];

    // get all published contributions that are not this
    // and that do not have this contrib as child
    async function getContributions(): Promise<Contribution[]>{
        return (await strapiService.getContributions()).filter(c => {
            return c.state == ContributionState.Published &&
            c.id != contribution.id &&
            !c.parents.find(id => id === contribution.id);
        });
    }

    async function handleShowSecondaryLinkSelector(){
        state = State.SelectSecondaryLink;
        contributions = await getContributions();
        console.log("contribs", contributions);
    }

    async function createNewContribution(){

        const parentContribution = contribution;
        const newContributionId = await strapiService.createNewContributionFromParent(parentContribution);
        console.log("new contribution id", newContributionId);
        if(newContributionId == -1){
            // TODO: handle error for user
            console.error("unable to create new contribution");
            return;
        }


        // open the editor 
        goto(`/editor/${newContributionId}`);
    }
    
    function requestSecondaryLinkCreation(e:any){
        const requestedContributionParent = e.detail;
        console.log("requestion link to contribution", requestedContributionParent);
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
            <VerticalContributionMiniList
                on:contributionSelectionRequest={requestSecondaryLinkCreation}
                contributions={contributions}/>
        </div>
    {/if}

</Modal>


<style>
    .second-panel{
        height: 70%;
    }
</style>


