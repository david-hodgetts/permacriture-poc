<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
    export let visible = false;

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close', {});

	let modal:HTMLElement;

    $:{
        // prevent scrolling of body
        if(visible){
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = `100vw`;
        }else{
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

	const handle_keydown = (e:any) => {
        if(!visible){
            return;
        }
        console.log("keydown event on modal", e);
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>


<svelte:window on:keydown={handle_keydown}/>
{#if visible}
    <div 
		class="modal-background" 
		on:click={close}
		on:keydown={() => {}}
		role="button"
		tabindex=0
		transition:fade={{duration:200}}
	></div>

    <div 
		class="modal" 
		role="dialog" 
		aria-modal="true" 
		bind:this={modal}
		transition:fade={{duration:150}}
	>
        <slot></slot>
        <!-- svelte-ignore a11y-autofocus -->
        <!-- <button autofocus on:click={close}>close modal</button> -->
    </div>
{/if}
<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #1A1A1AC9;
        z-index: 200;
	}

	.modal {
		position: fixed;
		left: 50%;
		top: 50%;
		width: calc(100vw - var(--app-modal-margin) * 2);
        max-width: calc(var(--app-max-width) - var(--app-modal-margin) * 2);
		height: var(--modal-height);
		/* max-width: 32em; */
		max-height: calc(100vh - 10em);
		overflow: auto;
		transform: translate(-50%,-50%);
		padding: 1em;
		border-radius: 16px;
		background: var(--color-background-default);
        color: var(--color-text-modal);
        z-index: 201;
	}
</style>