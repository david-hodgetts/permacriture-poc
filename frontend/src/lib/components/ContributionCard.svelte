<script lang="ts">
    import ContributionCardBackground from "./ContributionCard/ContributionCardBackground.svelte";
    import Counter from './ContributionCard/decoration/Counter.svelte';
    import LinkToMe from "./ContributionCard/decoration/LinkToMe.svelte";
    import BottomCounter from "./ContributionCard/decoration/BottomCounter.svelte";
    import NewContributionModal from "./Modals/NewContributionModal.svelte";
    import ParentChildrenLinks from "./ContributionCard/ParentChildrenLinks.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
	import Config from "$lib/services/Config";
    
	import { goto } from "$app/navigation";
    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    export let contribution: Contribution;

    const cardHeight = contribution.state == ContributionState.Editing ? 187 : 289
    
    // new contribution state
    let showNewContributionModal = false;
    let newContributionParentContribution: Contribution | null = null;

    let showTopLinks = false;
    let showBottomLinks = false;

    function onNewContributionModalCloseRequest(){
        showNewContributionModal = false;
        newContributionParentContribution = null;
    }

    function requestNewContribution(){
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

    function handleGotoDetailRequest(e:any){
        const contributionId = e.detail.id;
        goto(`/contribution/${contributionId}`);
    }

</script>


<NewContributionModal 
    visible={showNewContributionModal}
    parentContribution={newContributionParentContribution}
    on:ok={createNewContribution}
    on:close={onNewContributionModalCloseRequest}
    on:cancel={onNewContributionModalCloseRequest}
/>
<div class="contribution-card">
    <div class="top-decoration">
        {#if contribution.state === ContributionState.Published}
            <div class="clickable">
                <Counter 
                    count={contribution.isAbandonned ? 0 : contribution.children.length} 
                    isGraine={contribution.isGraine} 
                    isClickable={true}
                    on:click={() => showTopLinks = !showTopLinks}/>
                {#if showTopLinks}
                <ParentChildrenLinks 
                    contributionIds={contribution.isAbandonned ? [] : contribution.children} 
                    on:contributionSelection={handleGotoDetailRequest}
                    heightOffset="-5px"/>
                {/if}
            </div>
            <LinkToMe isGraine={contribution.isGraine} on:click={requestNewContribution} />
        {/if}
    </div>

    <ContributionCardBackground on:showDetailRequest contribution={contribution} height={cardHeight}/>
    
    {#if !contribution.isGraine}
        <div class="bottom-decoration">
            <BottomCounter 
                count={contribution.isAbandonned ? 0 : contribution.parents.length} 
                isClickable={true}
                on:click={() => showBottomLinks = !showBottomLinks}/>
            {#if showBottomLinks}
            <ParentChildrenLinks 
                contributionIds={contribution.isAbandonned ? [] : contribution.parents}
                on:contributionSelection={handleGotoDetailRequest}
                heightOffset="5px"/>
            {/if}
        </div>
    {/if}
</div>


<style>
    .contribution-card{
        width: 100%;
    }
    .top-decoration, .bottom-decoration{
        display: flex;
    }

    .clickable{
        display: flex;
    }
</style>