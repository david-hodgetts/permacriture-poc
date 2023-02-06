<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";
	import ContributionMiniCard from "./ContributionMiniCard.svelte";
    
    import { Swiper, SwiperSlide } from "swiper/svelte";
    import { Pagination } from "swiper";
    // Import Swiper styles
    import "swiper/css";
    import "swiper/css/pagination";

    export let contributions: Contribution[];
    const MaxSlidesPerView = 3;
</script>


<div class="container">
    <Swiper
        slidesPerView={(contributions.length > MaxSlidesPerView) ? MaxSlidesPerView : contributions.length}
        spaceBetween={30}
        pagination={{
            clickable: true,
        }}
        direction="vertical"
        modules={[Pagination]}
        class="swiper"
        style="height:100%"
    >
        {#each contributions as contribution (contribution.id)}
            <SwiperSlide class="swiper">
                <ContributionMiniCard  
                    contribution={contribution}
                    on:contributionSelectionRequest
                    maxHeight="220px"
                /> 
            </SwiperSlide>
        {/each}
    </Swiper>
</div>


<style>
    .container{
        height: 100%;
    }
</style>