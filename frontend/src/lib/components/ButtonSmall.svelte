<script lang="ts">
    import tippy from "$lib/actions/tippyAction";
    export let buttonType = 'primary';
    export let flat = true;
    export let inverse = false;
    export let disabled = false;
    export let tippyContent = "";
</script>

<button 
    on:click 
    disabled={disabled}
    class={buttonType} 
    class:flat={flat} 
    class:inverse={inverse} 
    class:disabled={disabled}
    use:tippy={{content: tippyContent}}
    >
    <slot></slot>
</button>

<style>
    button {
        border: 0;
        border-radius: 6px;
        width: 80px;
        height: 25px;
        cursor: pointer;
        /* padding: 0px 20px; */
        font-weight: bold;
        font-size: 13px;
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
        background: var(--color-text-default);
    }
    .secondary.inverse {
        color: #45c496;
        background: white;
        border: 2px solid #45c496
    }
    .neutral.invese{
        background-color: var(--color-background-app);
    }
    .primary.disabled {
        pointer-events: none;
        background-color: var(--color-background-app);
        color: white;
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