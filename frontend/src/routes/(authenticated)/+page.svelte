<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
    import JournalListFilter from "$lib/components/Navigation/JournalListFilter.svelte";

	import { Order, Filter, type Contribution, ContributionState } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import { isUnAuthorizedError, strapiService } from "$lib/services/StrapiService";
	import Config from "$lib/services/Config";
    
    import { getNotificationsContext } from 'svelte-notifications';
	import { page } from "$app/stores";
    import type { PageData } from "./$types";
    import { journalService } from "$lib/services/JournalService";
    const { addNotification } = getNotificationsContext();

    export let data: PageData;

    let rawContributions: Contribution[] = data.contributions;
    let contributions: Contribution[] = [];

    let order: Order;
    let filter: Filter;

    let timeoutId = -1;

    const orderParamKey = "order";
    const filterParamKey = "filter";

    onMount(() => {
        // @ts-ignore
        console.log("app version", __APP_VERSION__);
        // console.log("---------------- on mount");
        // console.log("---------------- journal memory", journalService.state);

        order = determineOrder();
        filter = determineFilter();
        setUrlParams(order, filter);

        const shouldFetchContributions = false;
        updateContributions(shouldFetchContributions);

        setTimeout(() => window.scrollTo(0, journalService.state.scrollPosition), 0);
    });
    
    onDestroy(() => {
        window.clearTimeout(timeoutId);
        // console.log("---------------- on destroy", window.scrollY);
        journalService.state = {
            scrollPosition: window.scrollY,
            filter:  filter,
            order,
        };
    });

    function determineOrder():Order{
        const param = $page.url.searchParams.get(orderParamKey);
        
        // query param overrides memory
        if(param && (param == Order.Ascending || param == Order.Descending)){
            console.log("determining order", param);
            return param;
        }
        
        return journalService.state.order;
    }

    function determineFilter(): Filter{
        const param = $page.url.searchParams.get(filterParamKey);
        if(param && (param == Filter.all || param == Filter.mine)){
            console.log("determining filter", param);
            return param;
        }
        return journalService.state.filter;
    }

    function setUrlParams(order: Order, filter: Filter){
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set(filterParamKey, filter);
        query.set(orderParamKey, order);

        goto(`?${query.toString()}`);
    }

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

    async function updateContributions(shouldFetchContributions=true){
        if(shouldFetchContributions){
            try{
                rawContributions = await getContributions();
                console.log("contributions fetched from backend");
            }catch(e){
                if(isUnAuthorizedError(e)){
                    return;
                }
            }
        } 

        contributions = [...rawContributions];
        
        // handle filter state
        if(filter == Filter.all){
            // only show published contributions on main page
            contributions = contributions.filter(c => c.state == ContributionState.Published);
        }else{
            // show all my contributions irrespective of state
            contributions = contributions.filter(c => c.isMine);
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
        filter = e.detail.filter;
        
        clearTimeout(timeoutId);
        updateContributions();
        
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set(filterParamKey, filter);
        goto(`?${query.toString()}`);
	}
</script>



<!-- dom -->

<JournalListFilter filter={filter} 
    order={order}
    on:filterChangeRequest={onFilterChangeRequest} 
    on:orderInvertRequest={onOrderInvertRequest} 
/>
<ContributionList 
    contributions={contributions} 
    on:showDetailRequest={onShowDetailRequest}
/>
