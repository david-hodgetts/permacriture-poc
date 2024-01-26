<script lang="ts">
    import NavTopRow from "./Navigation/NavTopRow.svelte";
</script>

<div class="navigation">
    <NavTopRow />
</div>


<style>
    .navigation {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        width: 100%;
        position: fixed;
        z-index: 100;
        top:0;
        left: 0;
        padding-bottom: 10px;
    }
</style>