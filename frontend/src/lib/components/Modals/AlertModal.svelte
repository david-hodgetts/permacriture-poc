<script lang="ts">
    import ModalBase from '$lib/components/ModalBase.svelte';
    import Button from '$lib/components/Button.svelte';
    import { createEventDispatcher } from 'svelte';

    export let visible:boolean;
    export let title:string;
    export let subTitle = "";
    export let okText = "ok";

    export let role = 'primary'; // 'primary' | 'danger' 

    const dispatch = createEventDispatcher();

</script>

<ModalBase visible={visible} on:close>
    <div class="content">
        <h2>{title}</h2>
        <h3>{subTitle}</h3>
        <div class="buttons">
            <Button 
                buttonType={role}
                on:click={() => dispatch('close', {})}
            >{okText}</Button>
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