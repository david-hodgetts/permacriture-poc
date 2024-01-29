<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    $: backgroundColor = contribution.isGraine ? "#525EF5" : contribution.color;
</script>

<a href={`/contribution/${contribution.id}`}>
    <div class="badge" style="background-color: {backgroundColor}">
        <div class="text no-select">
            {contribution.badgeText}
        </div>
    </div>
</a>

<style>
    .badge{
        width: 32px;
        height: 32px;
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 9px;
    }

    .text{
        font-size: 14px;
        font-weight: bold;
        color: var(--color-text-selected);
    }

    a{
        text-decoration: none;
    }
</style>