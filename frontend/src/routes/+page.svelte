<script lang="ts">
    // landing page
    import ContributionList from "$lib/components/ContributionList.svelte"
	import ContributionCard from "$lib/components/ContributionCard.svelte";
    import ListFilter from "$lib/components/ListFilter.svelte";
    import ContributionButtonList from "$lib/components/ContributionButtonList.svelte";

	import type { PageData } from "./$types";
	import { strapiService } from "$lib/services/StrapiService";
	import { Order, Filter, type Contribution } from "$lib/models/Contribution";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    export let data: PageData;

    let contributions: Contribution[] = [];

    let parentContributions: Contribution[] = []; // holds parents of selectedContribution
    let childContributions: Contribution[] = []; // holds children of selectedContribution

    let order = Order.Descending;
    let selectedFilter = Filter.all;
    
    let selectedContribution: Contribution | null = null;

    onMount(() => {
        updateContributions();
    });

    function onContributionSelectionRequest(e:any){
        const contributionId = e.detail.contributionId;
        selectedContribution = data.mapOfContributions.get(contributionId) as Contribution;

        parentContributions = selectedContribution!.parents.map((id) => {
            return data.mapOfContributions.get(id);
        }) as Contribution[];
        
        childContributions = selectedContribution!.children.map((id) => {
            return data.mapOfContributions.get(id);
        }) as Contribution[];
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
        on:cardSelectionRequest={onContributionSelectionRequest} 
        on:newContributionRequest={onNewContributionRequest}
    />
{:else}
    <!-- click catcher, closes focused card -->
    <div class="modal-close" 
        on:click={() => selectedContribution = null}/>

    <!-- parent contributions -->
    <div class="top">
        <ContributionButtonList 
            contributions={parentContributions}
            on:contributionSelectionRequest={onContributionSelectionRequest}
        />
    </div>

    <!-- focused contribution card -->
    <ContributionCard 
        contribution={selectedContribution} 
        isFocused={true}
        on:newContributionRequest={onNewContributionRequest}
    />
    
    <!-- child contributions -->
    <div class="bottom">
        <ContributionButtonList 
            contributions={childContributions}
            on:contributionSelectionRequest={onContributionSelectionRequest}
        />
    </div>
{/if}


<style>
    .modal-close{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .top{
        position: absolute;
        top:var(--navigation-height);
        left: 0;
        width: 100%;
        z-index: 2;
        pointer-events: none;
    }
    .bottom{
        position: absolute;
        bottom:0;
        left: 0;
        width: 100%;
        z-index: 3;
    }
</style>

