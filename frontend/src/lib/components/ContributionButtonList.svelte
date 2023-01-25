<script lang="ts">
    import { Swiper, SwiperSlide } from "swiper/svelte";
    import { Pagination } from "swiper";
    // Import Swiper styles
    import "swiper/css";
    import "swiper/css/pagination";
    
    import ContributionMiniButton from "./ContributionMiniButton.svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";

    export let contributions:Contribution[] = [];
    
    const dispatch = createEventDispatcher();

    const MaxSlidesPerView = 2;

    function onContributionSelectionRequest(e:any){
        dispatch('contributionSelectionRequest', e.detail);
    }

    function onModalCloseRequest(e:any){
        dispatch('endFocusMode', {});
    }

</script>

<div class="button-list" on:click={onModalCloseRequest}>
    <Swiper
        slidesPerView={(contributions.length > MaxSlidesPerView) ? MaxSlidesPerView : contributions.length}
        spaceBetween={30}
        pagination={{
            clickable: true,
        }}
        modules={[Pagination]}
        class="swiper"
        style="height:100%"
    >
        {#each contributions as contribution (contribution.id)}
            <SwiperSlide class="swiper">
                <ContributionMiniButton  
                    contribution={contribution}
                    on:click={onContributionSelectionRequest}   
                /> 
            </SwiperSlide>
        {/each}
    </Swiper>
</div>

<!-- <div class="button-list" on:click={onModalCloseRequest}>
    {#each contributions as contribution (contribution.id)}
        <ContributionMiniButton  
            contribution={contribution}
            on:click={onContributionSelectionRequest}   
        /> 
    {/each}
</div> -->



<style>
    .button-list{
        height: 100%;
    }
    .swiper{
        height: 100%;
    }
    /* .button-list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        height: 100%;
    } */
</style>