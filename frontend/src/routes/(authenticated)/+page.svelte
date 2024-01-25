<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import ListFilter from "$lib/components/ListFilter.svelte";
    import JournalListFilter from "$lib/new-components/Navigation/JournalListFilter.svelte";

	import { Order, Filter, type Contribution, ContributionState } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import { isUnAuthorizedError, strapiService } from "$lib/services/StrapiService";
	import Config from "$lib/services/Config";
    
    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();

    let contributions: Contribution[] = [];

    let order = Order.Descending;
    let selectedFilter = Filter.all;

    let timeoutId:number = -1;

    onMount(() => {
        // @ts-ignore
        console.log("app version", __APP_VERSION__);
        
        updateContributions();
    });

    onDestroy(() => {
        window.clearTimeout(timeoutId);
    });

    function onContributionSelectionRequest(e:any){
        const contributionId = e.detail.contributionId;
        goto(`/contribution/${contributionId}`);
    }

    async function getContributions():Promise<Contribution[]>
    {
        try{
            const newContributions: Contribution[] = await strapiService.getContributions();
            return newContributions;
        }catch(e){
            if(isUnAuthorizedError(e)){
                addNotification({
                    text: "not logged in",
                    position: "top-center",
                    type: "error",
                    removeAfter: Config.notificationDuration,
                });
            }
            
            addNotification({
                text: "unable to retrieve contributions",
                position: "top-center",
                type: "error",
                removeAfter: Config.notificationDuration,
            });
            
            throw e;
        }
    }

    async function updateContributions(){
        let newContributions: Contribution[] = [];        
        try{
            newContributions = await getContributions();
        }catch(e){
            newContributions = [...contributions];
            if(isUnAuthorizedError(e)){
                return;
            }
        }
        
        // remove abandoned contribs
        newContributions = newContributions.filter(c => c.state != ContributionState.Abandoned); 

        // handle filter state
        if(selectedFilter == Filter.all){
            contributions = newContributions;
        }else{
            contributions = newContributions.filter(c => c.isMine);
        }

        console.log("contributions updated");

        contributions = contributions.sort((a:Contribution, b: Contribution) => {
            const date_A = a.publicationDatetime || a.createdAt;
            const date_B = b.publicationDatetime || b.createdAt;

            if(order === Order.Ascending){
                return date_A.getTime() - date_B.getTime();
            }else{
                return date_B.getTime() - date_A.getTime();
            }
        });

        timeoutId = window.setTimeout(updateContributions, Config.updateRate);
    }

	function onOrderInvertRequest(e: CustomEvent<any>): void {
        order = (order == Order.Ascending) ? Order.Descending : Order.Ascending;

        clearTimeout(timeoutId);
        updateContributions();
	}

	function onFilterChangeRequest(e: CustomEvent<any>): void {
        selectedFilter = e.detail.filter;
        
        clearTimeout(timeoutId);
        updateContributions();
	}
</script>



<!-- dom -->

<JournalListFilter filter={selectedFilter} 
    on:filterChangeRequest={onFilterChangeRequest} 
    on:orderInvertRequest={onOrderInvertRequest} 
/>
<ContributionList 
    contributions={contributions} 
    on:cardSelectionRequest={onContributionSelectionRequest} 
/>
