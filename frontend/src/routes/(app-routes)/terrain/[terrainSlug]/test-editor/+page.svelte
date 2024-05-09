<script lang="ts">
	import { Contribution } from "$lib/models/Contribution";
	import EditorSystem from "$lib/components/EditorSystem.svelte";
	import TerrainTitle from "$lib/components/TerrainTitle.svelte";

    
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

    const testContributionEditing = new Contribution(editingContributionData);
</script>

    <!-- <DialogModal 
        title="Voulez-vous abandonner le texte en cours ?"
        subTitle="ce texte sera définitivement supprimé"
        visible={modalIsVisible} 
        on:close={() => modalIsVisible = false}
        on:dialogAccepted={() => modalIsVisible = false}
        >
    </DialogModal> -->

    <TerrainTitle />

    <EditorSystem contribution={testContributionEditing} />

<style>
</style>