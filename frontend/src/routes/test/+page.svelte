<script lang="ts">
	import { BadgeRole } from "$lib/components-utils/Badge";
    import Navigation from "$lib/new-components/Navigation.svelte";
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
    import ContributionCard from "$lib/new-components/ContributionCard.svelte";
	import { Contribution } from "$lib/models/Contribution";

    const graineContributionData = {
        "publicationDatetime": "2023-11-15T23:00:00.000Z",
        "id": 1,
        "text": "**terrain**: a) «L’opacité même de la page représente-t-elle l’impénétrabilité du monde ? Ou bien pourrions-nous imaginer une façon d’écrire et de lire qui pénètre au coeur même du tissage du monde, dans la formation en cours de ses surfaces et de ses textures ? La page, tout comme le sol, pourrait-elle devenir une zone habitable, une zone où l’expérience et l’imagination fusionnent.» (Tim Ingold «Textures de la surface : le sol et la page», 2020).",
        "state": "Published",
        "createdAt": "2023-12-04T09:17:49.284Z",
        "perAuthorTextIndex": -1,
        "author": null,
        "children": [],
        "parents": []
    }


    const testContributionGraine = new Contribution(graineContributionData)

    const publishedContributionData = {
        "publicationDatetime": "2023-12-04T11:03:40.442Z",
        "id": 9,
        "text": "<p>pipou framboise</p>",
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
        "parents": [
            1
        ]
    };

    const testPublishedContribution = new Contribution(publishedContributionData);
</script>

    <ContributorBadge text="B1" backgroundColor="red"/>
    <ContributorBadge role={BadgeRole.Map} text="B1" backgroundColor="red"/>
    <div class="list">

        <ContributionCard contribution={testPublishedContribution}/>
        <ContributionCard contribution={testContributionGraine}/>
    </div>

<style>
    .list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>