<script lang="ts">
	import { BadgeSize } from "$lib/components-utils/Badge";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
</script>

<div class="container">

    <h1>test page</h1>

    <ContributorBadge color="#ffaa00" text="DH"/>
    <ContributorBadge color="#00aaff" size={BadgeSize.Small} text="AR"/>
</div>

<style>
    .container{
        margin-left: 40px;
    }
</style>