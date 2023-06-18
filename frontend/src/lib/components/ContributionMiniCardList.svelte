<script lang="ts">
    import { Swiper, SwiperSlide } from "swiper/svelte";
    import { Pagination } from "swiper";
    // Import Swiper styles
    import "swiper/css";
    import "swiper/css/pagination";
    
    import ContributionMiniCard from "./ContributionMiniCard.svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import { createEventDispatcher } from "svelte";

    export let contributions:Contribution[] = [];
    export let showTotalParentCount = false;
    export let showTotalChildrenCount = false;
    
    const dispatch = createEventDispatcher();

    const MaxSlidesPerView = 3;

    // function onContributionSelectionRequest(e:any){
    //     dispatch('contributionSelectionRequest', e.detail);
    // }

    // a bit of a hack to allow users to close the focus mode by clicking on any empty white space
    function onModalCloseRequest(e:any){
        // disable exit focus mode
        // dispatch('endFocusMode', {});
    }

</script>

{#key contributions}
<div class="button-list" on:click={onModalCloseRequest} on:keydown={()=>{}}>
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
                <ContributionMiniCard  
                    showTotalParentCount={showTotalParentCount}
                    showTotalChildrenCount={showTotalChildrenCount}
                    contribution={contribution}
                    on:contributionSelectionRequest
                /> 
            </SwiperSlide>
        {/each}
    </Swiper>
</div>

{/key}

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