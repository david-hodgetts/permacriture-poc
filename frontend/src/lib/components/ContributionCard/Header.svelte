<script lang="ts">
    import ContributorBadge from "$lib/components/ContributorBadge.svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    const badgeTextColor = contribution.isGraine ? "#000" : "#fff";

    function formatPublicationDate(contribution: Contribution): string{
        if(!contribution || !contribution.publicationDatetime){
            return "";
        }

        const day = contribution.publicationDatetime.getDate();
        const month = (contribution.publicationDatetime.getMonth() + 1).toString().padStart(2, '0');
        const year = contribution.publicationDatetime.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    }

    function formatPublicationTime(contribution: Contribution): string{
        if(!contribution || !contribution.publicationDatetime){
            return "";
        }

        const hours = contribution.publicationDatetime.getHours();
        const minutes = contribution.publicationDatetime.getMinutes().toString().padStart(2, '0');

        return `${hours}h${minutes}`;
    }

    function formatDelayToPublication(contribution: Contribution): string{
        const totalMinutes = contribution.delayInMinutesBeforePublication;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h${minutes}`;
    }
</script>

<div class="header">
    <ContributorBadge 
        isGraine={contribution.isGraine} 
        backgroundColor={contribution.color} 
        text={contribution.badgeText} />
    <div 
        class="nickname"
        class:notPublished={contribution.state == ContributionState.Editing}
        class:graine={contribution.isGraine}
    >{contribution.nickname}</div>

    {#if contribution.state == ContributionState.Editing}
        <div class="editingTimeout">
            <img src="/images/icon-timer.svg" alt="">
            <span>{formatDelayToPublication(contribution)}</span>
        </div>
    {:else if contribution.state == ContributionState.Published && !contribution.isGraine}
        <div class="publicationDatetime">
            <span class="date">{formatPublicationDate(contribution)}</span>
            <span class="time">{formatPublicationTime(contribution)}</span>
        </div>
    {:else if contribution.state == ContributionState.Abandoned}
        <div class="editingTimeout">
            abandonné
        </div>
    {/if}
</div>


<style>
    .header{
        padding-top: 15px;
        display: flex;
        align-items: center;
        color: var(--color-text-default);
    }

    .nickname{
        padding-left: 15px;
        font-size: 19px;
        font-weight: bold;
    }

    .notPublished{
        color: var(--color-text-faded);
    }

    .graine{
        color: var(--color-text-selected);
    }

    .editingTimeout{
        display: flex;
        gap: 5px;
        margin-left: auto;
        margin-right: 0;
        position: relative;
        top: 1px;
        font-weight: bold;
        font-size: 13px;
        color: var(--color-text-faded);
    }

    .publicationDatetime{
        margin-left: auto;
        margin-right: 0;
        position: relative;
        top: 2px;
        font-weight: 500;
        font-size: 14px;
    }

    .time{
        padding-left: 12px;
    }
</style>