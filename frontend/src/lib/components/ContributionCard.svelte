<script lang="ts">
	import type { Contribution } from "$lib/models/Contribution";

    export let contribution: Contribution;

    function produceDateString(date:Date){
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    function produceTimeString(date:Date){
        return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
    }

</script>


<div class="contribution-card">
    <header>
        {#if contribution.author != null}
            <h2>contribution.author</h2>
        {:else}
            <h2>&nbsp</h2>
        {/if}
        <div class="date-time">
            <span>{produceDateString(contribution.publicationDatetime)}</span>
            <span>{produceTimeString(contribution.publicationDatetime)}</span>
        </div> 
    </header>
</div>



<style lang="scss">
    .contribution-card{
        background-color: var(--color-grey-0);
        height: var(--contribution-card-height);
        border-radius: 20px;
        color: var(--color-grey-1);
        padding-left:16.5px;
        padding-right:16.5px;
    }

    h2{
        margin: 0;
        padding: 0;
    }

    .date-time{
        font-size: var(--font-size-small);
    }

    header{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
</style>



