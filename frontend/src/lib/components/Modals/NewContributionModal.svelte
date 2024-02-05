<script lang="ts">
    import ModalBase from '$lib/components/ModalBase.svelte';
	import type { Contribution } from "$lib/models/Contribution";
    import Button from '$lib/components/Button.svelte';
    import { createEventDispatcher } from 'svelte';

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

<ModalBase visible={visible} on:close>
    <div class="content">
        <h2>"Créer une nouvelle contributions"</h2>
        <h3>{questionText}</h3>
        <div class="buttons">
            <Button 
                buttonType='neutral'
                on:click={handleCancel}
            >Non</Button>
            <Button 
                on:click={handleOk}
            >Oui</Button>
        </div>
    </div>
</ModalBase>

<style>
    .content{
        margin: auto;
        max-width: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    h2{
        font-weight: bold;
        font-size: 21px;
        margin: 0;
        padding-bottom: 10px;
    }
    h3{
        font-weight: normal;
        font-size: 18px;
        margin: 0;
    }

    .buttons{
        padding-top: 40px;
        display: flex;
        justify-content: center;
        gap: 37px
    }
</style>