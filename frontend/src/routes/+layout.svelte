<script>
    import Notifications from 'svelte-notifications';
    import "../style/app.scss";
</script>

<Notifications zIndex={4000}>
    <slot></slot>
</Notifications>

