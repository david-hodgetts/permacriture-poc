<script lang="ts">
    import SaveIcon from "$lib/icons/SaveIcon.svelte";
    export let disabled = true;

</script>

<button disabled={disabled} on:click class:disabled={disabled}>
    <SaveIcon disabled={disabled} />
    <div class:disabled={disabled} class="label no-select">sauver</div>
</button>

<style>
    button{
        display: flex;
        flex-direction: column;
        align-items: center;

        background: none;
        border: none;
        outline: none;
        box-shadow: none;
        cursor: pointer;
    }

    .label{
        font-size: 13px;
        font-weight: bold;
        color: var(--color-background-accent);
    }

    .disabled{
        color: var(--color-background-app);
        cursor: auto;
    }
</style>