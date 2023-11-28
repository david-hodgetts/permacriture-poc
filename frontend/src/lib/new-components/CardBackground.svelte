<script lang="ts">
   export let height: number; 
</script>

<div class="card" style={`height:${height}px`}>
    <slot></slot>
</div>


<style>
    .card{
        width: 100%;
        background-color: var(--color-secondary);
        border-radius: 10px;

    }
</style>