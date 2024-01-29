<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";
    import Navigation from "$lib/new-components/Navigation.svelte";
    import TerrainTitle from "$lib/new-components/TerrainTitle.svelte";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
    import ContributionCard from "$lib/new-components/ContributionCard.svelte";
    import DialogModal from "$lib/new-components/Modals/DialogModal.svelte";
    import Footer from "$lib/new-components/Footer.svelte";
    import Button from "$lib/new-components/Button.svelte";
	import { Contribution } from "$lib/models/Contribution";

    let modalIsVisible = false;

    const graineContributionData = {
        "publicationDatetime": "2023-11-15T23:00:00.000Z",
        "id": 1,
        "text": "**terrain**: a) «L’opacité même de la page représente-t-elle l’impénétrabilité du monde ? Ou bien pourrions-nous imaginer une façon d’écrire et de lire qui pénètre au coeur même du tissage du monde, dans la formation en cours de ses surfaces et de ses textures ? La page, tout comme le sol, pourrait-elle devenir une zone habitable, une zone où l’expérience et l’imagination fusionnent.» (Tim Ingold «Textures de la surface : le sol et la page», 2020).",
        "state": "Published",
        "createdAt": "2023-12-04T09:17:49.284Z",
        "perAuthorTextIndex": 1,
        "author": null,
        "children": [],
        "parents": []
    }

    const publishedContributionData = {
        "publicationDatetime": "2023-12-04T11:03:40.442Z",
        "id": 9,
        "text": "<p>pipo framboise célery</p>",
        "state": "Published",
        "createdAt": "2023-12-04T11:03:25.803Z",
        "perAuthorTextIndex": 3,
        "author": {
            "id": 4,
            "nickname": "Wagon",
            "createdAt": "2023-12-04T09:17:48.761Z",
            "updatedAt": "2023-12-04T09:17:48.761Z"
        },
        "children": [
            10
        ],
        "parents": [...Array(99).keys()]
    };
    
    const editingContributionData = {
        "publicationDatetime": "2023-12-04T11:03:40.442Z",
        "id": 10,
        "text": "**terrain**: a) «L’opacité même de la page représente-t-elle l’impénétrabilité du monde ? Ou bien pourrions-nous imaginer une façon d’écrire et de lire qui pénètre au coeur même du tissage du monde, dans la formation en cours de ses surfaces et de ses textures ? La page, tout comme le sol, pourrait-elle devenir une zone habitable, une zone où l’expérience et l’imagination fusionnent.» (Tim Ingold «Textures de la surface : le sol et la page», 2020).",
        "state": "Editing",
        "createdAt": "2023-12-04T11:03:25.803Z",
        "perAuthorTextIndex": 3,
        "author": {
            "id": 4,
            "nickname": "Wagon",
            "createdAt": "2023-12-04T09:17:48.761Z",
            "updatedAt": "2023-12-04T09:17:48.761Z"
        },
        "children": [
            10
        ],
        "parents": [
            1
        ]
    };

    const testContributionGraine = new Contribution(graineContributionData)
    const testContributionPublished = new Contribution(publishedContributionData);
    const testContributionEditing = new Contribution(editingContributionData);
</script>

    <DialogModal 
        title="Voulez-vous abandonner le texte en cours ?"
        subTitle="ce texte sera définitivement supprimé"
        visible={modalIsVisible} 
        on:close={() => modalIsVisible = false}
        on:dialogAccepted={() => modalIsVisible = false}
        >
    </DialogModal>

    <TerrainTitle />

    <div class="list">
        <ContributionCard contribution={testContributionPublished}/>
        <ContributionCard contribution={testContributionEditing}/>
        <ContributionCard contribution={testContributionGraine}/>
    </div>

    <Button on:click={() => modalIsVisible = true}>open modal</Button>

    <Footer/>

<style>
    .list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>