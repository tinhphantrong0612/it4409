<template>
  <div class="no-line-break">
    <the-admin-header 
      :showNavbarIcon="this.viewState" 
      :displayName="this.displayName"
      @click="showNav = !showNav">
    </the-admin-header>
    <the-admin-navbar
      :show="this.showNav"
      :viewState="this.viewState">
    </the-admin-navbar>
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
      viewState: 0,
      showNav: true,
      displayName: "",
    };
  },
  watch: {
    viewState: function() {
      if (this.viewState == 0) {
        this.showNav = true;
      }
    }
  },
  methods: {
    handleView() {
      if (window.innerWidth <= 1200) {
        if (window.innerWidth <= 800) {
          this.viewState = 2;
        }
        else {
          this.viewState = 1;
        }
      }
      else {
        this.viewState = 0;
      }
    },
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
    window.addEventListener('resize', this.handleView);
    this.getUserInformation();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleView);
  },
};
</script>