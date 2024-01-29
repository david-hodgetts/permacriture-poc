<script>
    export let disabled = true;
</script>

<svg class:disabled={disabled} xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27">
    <path id="Icon_material-save-alt" data-name="Icon material-save-alt" d="M28.5,18V28.5H7.5V18h-3V28.5a3.009,3.009,0,0,0,3,3h21a3.009,3.009,0,0,0,3-3V18Zm-9,1,3.885-3.87L25.5,17.25,18,24.75l-7.5-7.5,2.115-2.115L16.5,19V4.5h3Z" transform="translate(-4.5 -4.5)" fill="#525ef5"/>
</svg>

<style>
    
    path{
        fill:var(--color-background-accent);
    }

    .disabled path{
        fill: var(--color-background-app);
    }

</style>