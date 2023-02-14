<script lang="ts">
    import Modal from "./Modal.svelte";
    import VerticalContributionMiniList from "./VerticalContributionMiniList.svelte";
    import { ContributionState, type Contribution } from "$lib/models/Contribution";
    import { strapiService } from "$lib/services/StrapiService";
    import { createEventDispatcher, onMount } from "svelte";

    import { getNotificationsContext } from 'svelte-notifications';
    import Config from "$lib/services/Config";
    const { addNotification } = getNotificationsContext();

    const dispatch = createEventDispatcher();

    export let visible = false;
    export let contribution: Contribution;

    $:{
        if (visible){
            contributions = [];
            updateContributions();
        }
    }

    async function updateContributions (){
        contributions = await getContributions();
        console.log("contributions", contributions);
    }


    let contributions: Contribution[] = [];

    // get all published contributions except this one
    // and all its parent
    async function getContributions(): Promise<Contribution[]>{
        return (await strapiService.getContributions()).filter(c => {
            return  c.state == ContributionState.Published &&
                    c.id != contribution.id && 
                    !contribution.parents.includes(c.id);
        });
    }

    
    async function requestSecondaryLinkCreation(e:any){
        const requestedContributionParentId = e.detail.contributionId;
        console.log("requestion link to contribution", requestedContributionParentId);

        const newLinkId = await strapiService.addParentToContribution(contribution, requestedContributionParentId);
        if(newLinkId === -1){
            console.error("unable to create new parent link");
            addNotification({
                text: "unable to create new parent link",
                position: "top-center",
                type: "error",
                removeAfter: Config.notificationDuration,
            });
            return;
        }

        // operation was succesful
        console.log("add link operation successful");
        
        // close modal
        dispatch("close", {invalidationRequired:true});
    }
</script>



<Modal visible={visible} on:close>
    <div class="panel">
        <h3>select new parent</h3>
        {#if contributions.length > 0}
            <VerticalContributionMiniList
                on:contributionSelectionRequest={requestSecondaryLinkCreation}
                contributions={contributions}/>
        {:else}
            <div>Cette contribution n'a pas de candidat auquel se rattacher</div>
        {/if}
    </div>
</Modal>


<style>
    .panel{
        height: 70%;
    }
</style>


