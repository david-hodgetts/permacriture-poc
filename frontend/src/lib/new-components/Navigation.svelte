<script lang="ts">
    import NavTopRow from "./Navigation/NavTopRow.svelte";
</script>

<div class="navigation">
    <NavTopRow />
</div>


<style>
    .navigation {
        display: flex;
        justify-content: center;
        width: 100%;
        position: fixed;
        top:0;
        left: 0;
    }
</style>