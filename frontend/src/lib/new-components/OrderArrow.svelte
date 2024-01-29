<script lang="ts">
	import { Order } from "$lib/models/Contribution";

    export let order:Order = Order.Descending;
</script>


<img class:up={order == Order.Ascending} src="/images/icon-arrow-down.svg" alt="">


<style>
    .up{
        transform: scaleY(-1);
    }
</style>