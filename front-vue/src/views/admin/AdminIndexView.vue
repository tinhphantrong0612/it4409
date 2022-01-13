<template>
  <div>
    <the-admin-header :displayName="this.displayName"></the-admin-header>
    <the-admin-navbar></the-admin-navbar>
    <the-admin-content></the-admin-content>
  </div>
</template>

<script>
import TheAdminContent from "../../components/layout/admin/TheAdminContent.vue";
import TheAdminHeader from "../../components/layout/admin/TheAdminHeader.vue";
import TheAdminNavbar from "../../components/layout/admin/TheAdminNavbar.vue";

export default {
  name: "AdminIndexView",
  components: {
    TheAdminContent,
    TheAdminHeader,
    TheAdminNavbar,
  },
  data() {
    return {
      displayName: "",
    };
  },
  methods: {
    async getUserInformation() {
      let response = await fetch(`http://localhost:3000/user/login`, {
        credentials: "include",
      });
      var userInfo = await response.json();
      this.displayName = userInfo["DisplayName"];
    },
  },
  created() {
    this.handleView();
    window.addEventListener("resize", this.handleView);
    this.getUserInformation();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleView);
  },
};
</script>