<script lang=ts>
    import Editor from "./Editor.svelte";
    import Header from "./ContributionCard/Header.svelte";
	import type { Contribution } from "$lib/models/Contribution";
	import ButtonSmall from "./ButtonSmall.svelte";

    export let contribution: Contribution;
    
    function onTextChange(e:any){
        console.log("on text change", e.detail.text);
        contribution.text = e.detail.text
    }
</script>

<div class="editor-system">
    <Header contribution={contribution} />
    <Editor 
        placeholder="éditez votre contribution" 
        text={contribution.text}
        on:textchange={onTextChange}
    />
    <div class="footer">
        <div class="first-button">
            <ButtonSmall >sauver</ButtonSmall>
        </div>

        <ButtonSmall>esperlier</ButtonSmall>
        <ButtonSmall disabled={true}>publiforcer</ButtonSmall>
        <ButtonSmall inverse={true}>abondonner</ButtonSmall>
    </div>
</div>


<style>
    .editor-system{
        width: 100%;
        height: calc(100svh - 180px);
        display:flex;
        flex-direction: column;
        background-color: var(--color-background-default);
        border-radius: 16px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top:15px;
        padding-bottom:15px;

        overflow-y: scroll;
    }

    .footer{
        display: flex;
        justify-content: end;
        gap: 9px;
    }

    .first-button{
        margin-right:auto;
        margin-left: 0;
    }
</style>
