<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
    import { truncate, } from "$lib/services/textUtils";
	import { max } from "d3";

    export let contribution: Contribution;
    export let height: number; 
    
    const classFromRole = contribution.isGraine ? "graine" : 
        (contribution.state === ContributionState.Published ? "published" : "editing")  
</script>

<div class={`card ${classFromRole}`} 

    style={`height:${height}px`}>
    <Header contribution={contribution} />
    <div class="mainText" class:mainTextEditing={contribution.state == ContributionState.Editing}>
        {@html contribution.textHtml }
    </div>
    <Footer contribution={contribution}/>
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

    .published{
        background-color: var(--color-background-default);
        color: var(--color-text-default);
    }

    .graine{
        background-color: var(--color-background-accent);
        color: var(--color-text-selected);
    }

    .mainText{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;  
    }

    .mainTextEditing{
        -webkit-line-clamp: 4;
    }

    .mainText :global(p){
        margin-top: 15px;
        margin-bottom: 15px;
    }

</style>