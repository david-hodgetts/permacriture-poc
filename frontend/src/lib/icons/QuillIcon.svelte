<script lang="ts">
    export let selected = true;

</script>

<svg class:selected={selected} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.031" height="25.414" viewBox="0 0 24.031 25.414"><defs><clipPath id="a"><rect width="24.031" height="25.414" fill="#6e39ff"/></clipPath></defs><g transform="translate(0 0)"><g transform="translate(0 0)" clip-path="url(#a)"><path d="M18.617,13.157a4.669,4.669,0,0,0-2.794.818,65.217,65.217,0,0,1-8.949-.257,9.56,9.56,0,0,1-2.916-.684c-.476-.261-.018-.674.148-.8a35.161,35.161,0,0,1,7.188-3.355c-.138-.107-.447-.782-.585-.889a40.356,40.356,0,0,0-7.5,3.27c-5.862,4.031,9.135,4.79,12.363,4.93a4.319,4.319,0,0,0,3.049,1.049c1.938,0,3.509-.911,3.509-2.039s-1.571-2.039-3.509-2.039m0,2.415c-.775,0-1.405-.267-1.405-.6s.63-.6,1.405-.6,1.405.267,1.405.6-.63.6-1.405.6" transform="translate(1.906 8.178)" fill="#6e39ff"/><path d="M7.067,3.375,2.657,6.991l.873,4.88a2.016,2.016,0,0,0,1.16,1.484l8.484,3.792.506-.415L9.44,11.561a1.527,1.527,0,1,1,.78-.64l4.24,5.171.506-.415L12.91,6.617a2.01,2.01,0,0,0-1.229-1.429ZM.343,4.169l1.6,1.948L6.35,2.5,4.753.553A1.513,1.513,0,0,0,2.625.342L.553,2.041A1.511,1.511,0,0,0,.343,4.169" transform="translate(-0.001 0)" fill="#6e39ff"/></g></g></svg>

<style>
    svg{
        width: 24px;
        height: 25.41px;
    }
    
    path{
        fill: var(--color-text-default);
    }

    .selected path{
        fill:var(--color-background-default)
    }

</style>