<script lang="ts">
	import type { PageData } from "./$types";
    import Editor from "$lib/components/Editor.svelte";
	import { strapiService } from "$lib/services/StrapiService";

    import { getNotificationsContext } from 'svelte-notifications';
    import Config from "$lib/services/Config";
    const { addNotification } = getNotificationsContext();

    export let data: PageData;

    async function saveText(){
        try{
            await strapiService.updateContribution({ id: data.contribution.id, text: data.contribution.text }) 
            addNotification({
                text: "save succesful",
                position: 'top-center',
                type: 'success',
                removeAfter: Config.notificationDuration,
            });
        }catch(e){
            console.error(e);
            addNotification({
                text:e,
                position: 'top-center',
                type: 'error',
                removeAfter: Config.notificationDuration,
            });
        }
    }

    function onTextChange(e:any){
        data.contribution.text = e.detail.text
    }
</script>


<!-- dom -->


<div class="editor">
    <Editor
        placeholder="éditez votre contribution"
        text={data.contribution.text}
        on:textchange={onTextChange}
    />
    <button on:click={saveText}>save</button>
</div>


<!-- style -->

<style lang="scss">
    .editor{
        width: 100%;
        height: calc(90vh - var(--navbar-height));
    }
</style>