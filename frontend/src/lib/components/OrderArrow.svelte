<script lang="ts">
	import { Order } from "$lib/models/Contribution";
    import tippy from "$lib/actions/tippyAction"
    export let order:Order = Order.Descending;
</script>


<img 
    class:up={order == Order.Ascending} 
    use:tippy={{content:'changer l’ordre chronologique'}}
    src="/images/icon-arrow-down.svg" 
    alt=""
>


<style>
    .up{
        transform: scaleY(-1);
    }
</style>