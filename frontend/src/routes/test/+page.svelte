<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";
    import Navigation from "$lib/new-components/Navigation.svelte";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
    import PublishedContributionCard from "$lib/new-components/PublishedContributionCard.svelte";
</script>

    <ContributorBadge text="B1" color="red"/>
    <ContributorBadge role={BadgeRole.Map} text="B1" color="red"/>
    <!-- <PublishedContributionCard /> -->

<style>
</style>