<template>
    <div>
        <the-admin-header></the-admin-header>
        <the-admin-navbar></the-admin-navbar>
        <the-admin-content></the-admin-content>
    </div>
</template>

<script>
import TheAdminContent from '../../components/layout/admin/TheAdminContent.vue';
import TheAdminHeader from '../../components/layout/admin/TheAdminHeader.vue';
import TheAdminNavbar from '../../components/layout/admin/TheAdminNavbar.vue';

export default {
    name: "AdminIndexView",
    components: {
        TheAdminContent,
        TheAdminHeader,
        TheAdminNavbar
    }
}
</script>