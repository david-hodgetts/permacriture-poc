<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import ListFilter from "$lib/components/ListFilter.svelte";
    import JournalListFilter from "$lib/components/Navigation/JournalListFilter.svelte";

	import { Order, Filter, type Contribution, ContributionState } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import { isUnAuthorizedError, strapiService } from "$lib/services/StrapiService";
	import Config from "$lib/services/Config";
    
    import { getNotificationsContext } from 'svelte-notifications';
	import { page } from "$app/stores";
    const { addNotification } = getNotificationsContext();

    let contributions: Contribution[] = [];

    let order: Order = determineOrder();
    let selectedFilter = determineFilter();

    let timeoutId:number = -1;

    const orderParamKey = "order";
    const filterParamKey = "filter";

    onMount(() => {
        // @ts-ignore
        console.log("app version", __APP_VERSION__);
        
        updateContributions();
    });
    
    onDestroy(() => {
        window.clearTimeout(timeoutId);
    });

    function determineOrder():Order{
        const param = $page.url.searchParams.get(orderParamKey);
        if(param && (param == Order.Ascending || param == Order.Descending)){
            console.log("determining order", param);
            return param;
        }
        console.log("determining order", Order.Descending);
        return Order.Descending;
    }

    function determineFilter(): Filter{
        const param = $page.url.searchParams.get(filterParamKey);
        if(param && (param == Filter.all || param == Filter.mine)){
            console.log("determining filter", param);
            return param;
        }
        console.log("determining order", Order.Descending);
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set(filterParamKey, Filter.all);
        goto(`?${query.toString()}`);
        return Filter.all;
    }

    // function onContributionSelectionRequest(e:any){
    //     const contributionId = e.detail.contributionId;
    //     goto(`/contribution/${contributionId}`);
    // }

    function onShowDetailRequest(e:any){
        const contributionId = e.detail.id;
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
        
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set(orderParamKey, order);
        goto(`?${query.toString()}`);
	}

	function onFilterChangeRequest(e: CustomEvent<any>): void {
        selectedFilter = e.detail.filter;
        
        clearTimeout(timeoutId);
        updateContributions();
        
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set(filterParamKey, selectedFilter);
        goto(`?${query.toString()}`);
	}
</script>



<!-- dom -->

<JournalListFilter filter={selectedFilter} 
    order={order}
    on:filterChangeRequest={onFilterChangeRequest} 
    on:orderInvertRequest={onOrderInvertRequest} 
/>
<ContributionList 
    contributions={contributions} 
    on:showDetailRequest={onShowDetailRequest}
/>
