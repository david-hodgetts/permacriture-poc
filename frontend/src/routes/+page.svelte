<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
	import ContributionCard from "$lib/components/ContributionCard.svelte";
    import ListFilter from "$lib/components/ListFilter.svelte";


	import type { PageData } from "./$types";
	import { strapiService } from "$lib/services/StrapiService";
	import { Order, Filter, type Contribution } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    export let data: PageData;

    let contributions: Contribution[] = [];

    let order = Order.Descending;
    let selectedFilter = Filter.all;
    
    let selectedContribution: Contribution | null = null;

    onMount(() => {
        updateContributions();
    });

    function onCardSelectionRequest(e:any){
        selectedContribution = e.detail.contribution;
    }

    async function onNewContributionRequest(e:any){
        const parentContribution = e.detail.contribution;
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

    function updateContributions(){
        if(selectedFilter == Filter.all){
            contributions = data.contributions;
        }else{
            contributions = data.contributions.filter(c => c.isMine);
        }

        contributions = contributions.sort((a:Contribution, b: Contribution) => {
            const date_A = a.publicationDatetime || a.createdAt;
            const date_B = b.publicationDatetime || b.createdAt;

            if(order === Order.Ascending){
                return date_A.getTime() - date_B.getTime();
            }else{
                return date_B.getTime() - date_A.getTime();
            }
        });
    }

	function onOrderInvertRequest(e: CustomEvent<any>): void {
        order = (order == Order.Ascending) ? Order.Descending : Order.Ascending;
        updateContributions();
	}

	function onFilterChangeRequest(e: CustomEvent<any>): void {
        selectedFilter = e.detail.filter;
        updateContributions();
	}
</script>



<!-- dom -->

{#if selectedContribution === null}
    <ListFilter filter={selectedFilter} 
        on:filterChangeRequest={onFilterChangeRequest} 
        on:orderInvertRequest={onOrderInvertRequest} 
    />
    <ContributionList 
        contributions={contributions} 
        on:cardSelectionRequest={onCardSelectionRequest} 
        on:newContributionRequest={onNewContributionRequest}
    />
{:else}
    <ContributionCard 
        contribution={selectedContribution} 
        isFocused={true}
        on:newContributionRequest={onNewContributionRequest}
        on:closeRequest={() => selectedContribution = null}
    />
{/if}


