<script lang="ts">
    import NavDot from "$lib/icons/NavDot.svelte";
    import { page } from "$app/stores";
    
    $: isMine = !!$page.url.searchParams.get("mes-textes"); 
</script>

<div class="row no-select">
    <div class="capsule">
        <a href="/" class:link-inactive={!isMine}>
            <div class="item left" class:selected={!isMine}>
                <NavDot isSelected={!isMine} />
                <div class="text">tous les textes</div>
            </div>
        </a>
        <a href="/?mes-textes=1" class:link-inactive={isMine}>
            <div class="item right" class:selected={isMine}>
                <NavDot isSelected={isMine} />
                <div class="text">mes textes</div>
            </div>
        </a>
    </div>
</div>

<style>

    a{
        text-decoration: none;
    }
    
    .link-inactive{
        pointer-events: none;
    }

    .row{
        display: flex;
        justify-content: center;
        color: var(--color-primary);
        gap: 6px;
    }

    .capsule{
        width: 316px;
        height: 43px;
        background-color: var(--color-background-default);
        color: var(--color-text-default);
        border-radius: 43px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5px;

        font-size: 17px;
        font-weight: 500;
    }

    .selected{
        font-weight: bold;
    }

    .left{
        padding-left: 12px;
    }

    .right{
        padding-right: 17px;
    }

    .text{
        color: var(--color-text-default);
    }

</style>