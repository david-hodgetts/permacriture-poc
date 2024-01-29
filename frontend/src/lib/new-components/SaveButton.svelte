<script lang="ts">
    import SaveIcon from "$lib/icons/SaveIcon.svelte";
    export let disabled = true;

</script>

<button disabled={disabled} on:click class="save-button">
    <SaveIcon disabled={disabled} />
    <div class:disabled={disabled} class="label no-select">sauver</div>
    
</button>

<style>
    .save-button{
        display: flex;
        flex-direction: column;
        align-items: center;

        background: none;
        border: none;
        outline: none;
        box-shadow: none;
    }

    .label{
        font-size: 13px;
        font-weight: bold;
        color: var(--color-background-accent);
    }

    .disabled{
        color: var(--color-background-app);
    }
</style>