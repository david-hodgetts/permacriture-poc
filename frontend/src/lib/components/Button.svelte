<script lang="ts">
    export let buttonType = 'primary';
    export let flat = true;
    export let inverse = false;
    export let disabled = false;

</script>

<button 
    on:click 
    disabled={disabled}
    class={buttonType} 
    class:flat={flat} 
    class:inverse={inverse} 
    class:disabled={disabled}>
    <slot></slot>
</button>

<style>
    button {
        border: 0;
        border-radius: 16px;
        min-width: 89px;
        height: 54px;
        cursor: pointer;
        padding: 0px 20px;
        font-weight: bold;
        font-size: 18px;
    }
    /* button types  */
    .primary {
        background: var(--color-background-accent);
        color: white;
    }
    .secondary {
        background: #45c496;
        color: white;
    }
    .danger {
        background: var(--color-background-danger);
        color: white;
    }
    .neutral{
        background: var(--color-text-modal);
        color: white;
    }
    /* options  */
    .flat {
        box-shadow: none
    }
    .primary.inverse {
        color: #d91b42;
        background: white;
        border: 2px solid #d91b42
    }
    .secondary.inverse {
        color: #45c496;
        background: white;
        border: 2px solid #45c496
    }
    .primary.disabled {
        pointer-events: none;
        background-color: whitesmoke;
        color: lightgrey
    }
    .neutral.disabled{
        pointer-events: none;
        background-color: whitesmoke;
        color: lightgrey
    }
    .secondary.disabled {
        pointer-events: none;
        background-color: whitesmoke;
        color: lightgrey
    }
    .danger.disabled {
        pointer-events: none;
        background-color: whitesmoke;
        color: lightgrey
    }


</style>