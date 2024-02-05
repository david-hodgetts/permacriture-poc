<script lang="ts">
    import ModalBase from '$lib/components/ModalBase.svelte';
    import Button from '$lib/components/Button.svelte';
    import EsperlinkCheckBox from '../Esperlink/EsperlinkCheckBox.svelte';
    import { ContributionState, type Contribution } from "$lib/models/Contribution";
    import { strapiService } from "$lib/services/StrapiService";
    import { createEventDispatcher } from "svelte";

    import { getNotificationsContext } from 'svelte-notifications';
    import Config from "$lib/services/Config";
	import type { id } from '$lib/models/Id';
    const { addNotification } = getNotificationsContext();

    const dispatch = createEventDispatcher();

    export let visible:boolean;
    export let contribution: Contribution;

    let setOfSelectedContributions = new Set<id>();
    let contributions: Contribution[] = [];

    $:{
        if (visible){
            contributions = [];
            updateContributions();
        }
    }

    async function updateContributions (){
        contributions = await getContributions();
        setOfSelectedContributions = new Set<id>();
        console.log("contributions", contributions);
    }

    // get all published contributions except this one
    // and all its parent
    async function getContributions(): Promise<Contribution[]>{

        return (await strapiService.getContributions()).filter(c => {
            return  c.state == ContributionState.Published &&
                    c.id != contribution.id && 
                    !contribution.parents.includes(c.id);
        });
    }

    async function linkAllRequestedParents(){
        for(const id of setOfSelectedContributions){
            requestSecondaryLinkCreation(id);
        }
    }
    
    async function requestSecondaryLinkCreation(requestedContributionParentId: id){
    
        // const requestedContributionParentId = e.detail.contributionId;
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
            dispatch("close", {invalidationRequired:true});
            return;
        }

        // update local copy of contribution to ensure we can reopen 
        // the modal witout needing to reload
        contribution.parents.push(requestedContributionParentId);


        // operation was succesful
        console.log("add link operation successful");
        addNotification({
            text: "esperliation réussie",
            position: "top-center",
            type: "success",
            removeAfter: Config.notificationDuration,
        });
        
        // close modal
        dispatch("close", {invalidationRequired:true});
    }

    function onSelected(e){
        const {contributionId, selected} = e.detail;

        if(selected){
            setOfSelectedContributions.add(contributionId);
        }else{
            setOfSelectedContributions.delete(contributionId);
        }

        // force reactivity
        setOfSelectedContributions = new Set(setOfSelectedContributions); 
        console.log("set of selected contribution ids", setOfSelectedContributions);
    }

</script>

<ModalBase visible={visible} on:close>
    <div class="content">
        <h2>Avec quels textes souhaitez-vous vous esperlier ?</h2>
        <div class="linkable-contributions">
            {#each contributions as linkableContribution}
                <EsperlinkCheckBox contribution={linkableContribution} on:selectChange={onSelected} />
            {/each}
        </div>

        <div class="buttons">
            <Button 
                buttonType="neutral"
                on:click={() => dispatch("close", {})}
            >
                annuler
            </Button>
            <Button 
                on:click={linkAllRequestedParents}
                disabled={setOfSelectedContributions.size == 0}
            >
                accepter
            </Button>
        </div>
    </div>
</ModalBase>

<style>
    .content{
        margin: auto;
        max-width: 427px;
        display: flex;
        gap: 40px;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    
    h2{
        font-weight: bold;
        font-size: 21px;
        margin: 0;
        padding-bottom: 10px;
    }

    .linkable-contributions{
        display: flex;
        flex-direction: column;
        max-height: 30svh;
        overflow-y: scroll;
        gap: 20px;
    }

    .buttons{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }
</style>