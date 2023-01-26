<script lang="ts">
	import { goto } from "$app/navigation";
	import type { Contribution } from "$lib/models/Contribution";
	import { strapiService } from "$lib/services/StrapiService";
    import Modal from "./Modal.svelte";
    export let visible = false;

    export let contribution: Contribution;

    enum State { SelectLinkType, SelectSecondaryLink }
    let state = State.SelectLinkType;

    async function CreateNewContribution(){

        const parentContribution = contribution;
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
</script>



<Modal visible={visible} on:close>
    <h2 slot="header">lier</h2>
    {#if state === State.SelectLinkType}
        <button on:click={CreateNewContribution}>nouvelle contribution</button>
        <button>lier à une contribution existante</button>

    {:else}
        <h3>contrib selector</h3>
    {/if}

</Modal>


