<script lang="ts">
    import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { Contribution } from "$lib/models/Contribution";
	import type { id } from "$lib/models/Id";
	import { strapiService } from "$lib/services/StrapiService";
	import { onMount, createEventDispatcher } from "svelte";
	import MiniBadge from "./MiniBadge.svelte";
    import { page } from '$app/stores';
	import { ParentChildrenLinksPosition } from '$lib/models/Misc';


    const dispatch = createEventDispatcher();

    export let contributionIds:id[] = []; 
    export let heightOffset:string;
    export let position:ParentChildrenLinksPosition = ParentChildrenLinksPosition.TOP;

    let contributions: Contribution[] = [];
    let options = { loop: false, dragFree: true };

    $: miniBadgeToolTipText = position == ParentChildrenLinksPosition.TOP ? 
        "lire un texte lié ultérieurement":
        "lire un texte lié antérieurement";
    onMount(async() => {
        // contributions = await strapiService.getContributions();
        // contributions = [
        //     ...contributions,
        //     ...contributions,
        //     ...contributions,
        //     ...contributions,
        //     ...contributions,
        // ]
        
        const {terrainSlug} = $page.params;
        const promises = contributionIds.map((id:id) => {
            return strapiService.contributionForTerrainWithId(terrainSlug, id);
        });
        try{
            contributions = await Promise.all(promises);
        }catch(e){
            console.error(e);
        }
    });

</script>

<div class="links embla" style="top:{heightOffset}" use:emblaCarouselSvelte="{{ options }}">
    <div class="embla__container">
        {#each contributions as contribution}
            <div class="embla__slide">
                <MiniBadge 
                    contribution={contribution} 
                    toolTipText={miniBadgeToolTipText}
                    on:click={() => dispatch("contributionSelection", {id: contribution.id})} />
            </div>
        {/each}
    </div>
</div>


<style>
    .links{
        position:relative;
        margin-left: 10px;
    }
    .embla { 
        overflow: hidden;  
    }  
    .embla__container {   
        display: flex;  
        gap: 6px;
    }  
    .embla__slide {  
        /* flex: 0 0 100%;    
        min-width: 0;   */
    }
</style>