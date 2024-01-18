<script lang="ts">
    import AuthorListElement from './terrainTitle/AuthorListElement.svelte';
	import type Author from '$lib/models/Author';
	import { strapiService } from '$lib/services/StrapiService';
    import UserStore from '$lib/stores/user.store';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

    let modalIsOpen = false;

    $: {
        if(!$UserStore.user){
            goto('/login');
        }   
    }

    let authors: Author[] = [];
    
    $:{
        // prevent scrolling of body
        if(modalIsOpen){
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = `100%`;
        }else{
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    onMount(async () => {
        try{
            authors = await strapiService.getAuthors();
            authors = authors.sort((a, b) => a.nickname.localeCompare(b.nickname));
        }catch(e){
            console.error(e);
        }
    });

    function close(){
        modalIsOpen = false;
    }
</script>

<div class="terrain-title no-select" on:click={() => modalIsOpen = true} role="button" tabindex=0  on:keydown={() => null}>
    <h2>
        {$UserStore.user?.context.terrain.title}
    </h2>

    {#if modalIsOpen}
        <div 
            class="modal-background" 
            on:click|stopPropagation={close}
            on:keydown={() => {}}
            role="button"
            tabindex=0
        ></div>
        <div class="author-list" transition:fade={{duration:200}}>
            <div class="arrow-up"></div>
            <div class="author-list-background">
                {#each authors as author}
                    <AuthorListElement author={author} />
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .terrain-title{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }


    h2{
        font-size: 13px;
        color: var(--color-background-accent);
        text-align: center;
    }

    .author-list{
        position:absolute;
        top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2000;
    }

    .author-list-background{
        position:relative;
        width: 221px;
        height: 150px;
        border-radius: 10px;
        background-color: var(--color-background-default);
        overflow-y: scroll;
        filter: drop-shadow(0px 9px 10px #cbcbcb);
        padding-left: 20px;

        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .arrow-up {
        width: 0; 
        height: 0; 
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        border-bottom: 14px solid white;
        z-index: 10;
    }
 
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #00000000;
        z-index: 1999;
	}
</style>