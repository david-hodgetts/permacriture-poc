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

    // a bit of a hack to allow users to close the focus mode by clicking on any empty white space
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
                    on:contributionSelectionRequest
                /> 
            </SwiperSlide>
        {/each}
    </Swiper>
</div>


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