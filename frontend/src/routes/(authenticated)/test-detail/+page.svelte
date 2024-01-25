<script lang="ts">
	import { Contribution } from "$lib/models/Contribution";
    import ContributionCardDetail from "$lib/new-components/ContributionCardDetail.svelte";
    
    const detailContributionData = {
        "publicationDatetime": "2023-12-04T11:03:40.442Z",
        "id": 10,
        "text": "Lorem ipsum dolor sit amet Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et serConsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et serConsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam. Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et serConsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
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

    const testContributionEditing = new Contribution(detailContributionData);
</script>

<ContributionCardDetail contribution={testContributionEditing} />

<style>
</style>