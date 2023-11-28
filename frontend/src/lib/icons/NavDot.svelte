<script lang="ts">
    export let isSelected = false;
</script>

{#if isSelected}
    <div class="dot selected">
        <div class="center"></div>
    </div>
{:else}
    <div class="dot unselected">
    </div>
{/if}

<style>
    .dot{
        width: 20px;
        height: 20px;
    }
    .selected{
        border-radius: 20px;
        border: 2px solid var(--color-primary);
        background-color: var(--color-secondary);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .selected .center{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: var(--color-primary);
    }
    .unselected{
        border-radius: 20px;
        border: 2px solid var(--color-primary);
    }

</style>