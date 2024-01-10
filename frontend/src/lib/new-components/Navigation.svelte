<script lang="ts">
    import NavTopRow from "./Navigation/NavTopRow.svelte";
    import NavBottomRow from "./Navigation/NavBottomRow.svelte";
</script>

<div class="navigation">
    <NavTopRow />
    <NavBottomRow />
</div>


<style>
    .navigation {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        width: 100%;
        position: fixed;
        top:0;
        left: 0;
        padding-bottom: 10px;
    }
</style>