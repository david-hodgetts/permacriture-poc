<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import type { id } from "$lib/models/Id";
	import { strapiService } from "$lib/services/StrapiService";
	import { onMount } from "svelte";
	import MiniBadge from "./MiniBadge.svelte";

    export let contributionIds:id[] = []; 
    export let offset:string;

    let contributions: Contribution[] = [];

    onMount(async() => {
        const promises = contributionIds.map((id:id) => {
            return strapiService.contributionWithId(id);
        });
        try{
            contributions = await Promise.all(promises);
        }catch(e){
            console.error(e);
        }
    });

</script>

<div class="links" style="top:{offset}">
    {#each contributions as contribution}
        <MiniBadge contribution={contribution} />
    {/each}
</div>


<style>
    .links{
        position:relative;
        padding-left: 10px;
    }
</style>