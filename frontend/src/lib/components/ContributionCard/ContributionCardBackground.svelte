<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;
    export let height: number; 

    export let isInDetailCard = false;

    export let maxHeight = "";

    let heightStyleString = height > 0 ? `height:${height}px` : ""
    
    const classFromRole = contribution.isGraine ? "graine" : 
        (contribution.state === ContributionState.Published ? "published" : "editing")  
</script>

<div class={`card ${classFromRole}`} 

    style={`${heightStyleString} max-height:${maxHeight}`}>
    <Header contribution={contribution} />
    <div 
        class="mainText" 
        class:textEllipsis={!isInDetailCard}
        class:scrollable={isInDetailCard}
        class:not-scrollable={!isInDetailCard}
        class:textEllipsisForEditingState={contribution.state == ContributionState.Editing && !isInDetailCard}>
        {@html contribution.textHtml }
    </div>
    <Footer on:showDetailRequest isInDetailCard={isInDetailCard} contribution={contribution}/>
</div>


<style>
    .card{
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 16px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .editing{
        background-color: var(--color-background-editing);
        color: var(--color-text-faded);
        
        border: 2px #707070;
    }

    .not-scrollable{
        overflow: hidden;
    }

    .scrollable{
        overflow-y: scroll;
    }

    .published{
        background-color: var(--color-background-default);
        color: var(--color-text-default);
    }

    .graine{
        background-color: var(--color-background-accent);
        color: var(--color-text-selected);
    }

    .mainText{
        margin: 10px 0 15px 0;
    }

    .textEllipsis{
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;  
        display: -webkit-box; 
    }

    .textEllipsisForEditingState{
        -webkit-line-clamp: 4;
    }

    .mainText :global(p){
        margin:0;
    }

</style>