<script lang="ts">
	import { BadgeSize } from "$lib/components-utils/Badge";
    import Navigation from "$lib/new-components/Navigation.svelte";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
</script>

<div class="container">
    <Navigation/>


    
    <!-- <ContributorBadge color="#ffaa00" text="DH"/>
    <ContributorBadge color="#00aaff" size={BadgeSize.Small} text="AR"/> -->
</div>

<style>
    .container{
        margin-left: 40px;
    }
</style>