<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
    import Modal from "./Modal.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let parentContribution:Contribution | null;
    export let visible = false;

    // distinguish case where parent contribution is a graine
    $: questionText = parentContribution?.author ? `Voulez-vous créer une contribution liée à la contribution de ${parentContribution?.author?.nickname} ${parentContribution.perAuthorTextIndex}` :
         "Voulez-vous créer une contribution liée à cette graine?"


	function handleOk() {
        dispatch("ok", {});
	}

	function handleCancel() {
        dispatch("cancel", {});
	}
</script>


<Modal height="280px" visible={visible} on:close>
    <div class="panel">
        <h3>
            {questionText}
        </h3>
        <div class="buttons">
            <button on:click|stopPropagation={handleOk}>Oui</button>
            <button on:click|stopPropagation={handleCancel}>Annuler</button>
        </div>
    </div>
</Modal>

<style>
    .panel{
        height: 200px;
    }
</style>