<script lang="ts">
    export let isDisabled = true;
</script>

<button disabled >
    <img class:disabled={isDisabled} src="/images/icon-saved.svg" alt="">
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

    .disabled {
        filter: grayscale(100%) opacity(30%);
    }

    .label{
        font-size: 13px;
        font-weight: bold;
        color: var(--color-background-accent);
    }

</style>