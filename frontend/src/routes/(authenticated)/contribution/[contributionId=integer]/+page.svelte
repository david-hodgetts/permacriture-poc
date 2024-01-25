<script lang="ts">
	import type { PageData } from "./$types";
    import ContributionCardDetail from "$lib/new-components/ContributionCardDetail.svelte";
	import { goto } from "$app/navigation";

    export let data: PageData;


    function onContributionSelectionRequest(e:any){
        const contributionId = e.detail.contributionId;
        goto(`/contribution/${contributionId}`);
    }
</script>


<!-- dom -->

<ContributionCardDetail
    contribution={data.contribution} 
/>
    

<style>
    
</style>