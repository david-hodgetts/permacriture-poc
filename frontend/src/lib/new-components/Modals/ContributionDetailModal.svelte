<script lang="ts">
    import type { Contribution } from "$lib/models/Contribution";
    import ModalBaseForDetail from "../ModalBaseForDetail.svelte";
    import ContributionCardDetail from "../ContributionCardDetail.svelte";
	import { goto } from "$app/navigation";
	import { style } from "d3";
    export let visible = false;
    export let contribution: Contribution;

    export let path = "/map";

    function onContributionSelection(e){
        const contributionId = e.detail.id;
        goto(`${path}/${contributionId}?show-detail=true`)
    }
</script>

<ModalBaseForDetail visible={visible} zIndex={100} on:close>
        <ContributionCardDetail 
            contribution={contribution} 
            on:contributionSelection={onContributionSelection}
            />
</ModalBaseForDetail>


<style>
</style>
