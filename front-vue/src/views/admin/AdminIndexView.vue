<template>
  <div class="no-line-break">
    <the-admin-header 
      :showNavbarIcon="this.viewState" 
      :displayName="this.displayName"
      @click="showNav = !showNav">
    </the-admin-header>
    <the-admin-navbar
      :show="this.showNav"
      :isNewMessage="this.isNewMessage"
      :viewState="this.viewState"
      @switch-view="currentView = $event"
      >
    </the-admin-navbar>
    <the-admin-content @update="handleUpdate($event)"></the-admin-content>
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
      isNewMessage: false,
      currentView: "storage"
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
    async subscribe() {
      let response = await fetch(`${this.$currentOrigin}/api/message/subscribe`, {
        credentials: "include"
      })
      if (response.status == 502) {// Time out
        this.subscribe();
      } else if (response.status != 200) {
        this.errorMessage = response.statusText;
        console.log(response.statusText)
        await Promise(resolve => setTimeout(resolve, 1000));
        this.subscribe();
      } else {
        console.log("New message");
        this.isNewMessage = true;
        this.subscribe();
      }
    },
    async getUserInformation() {
      let response = await fetch(`${this.$currentOrigin}/user/login`, {
        credentials: "include",
      });
      var userInfo = await response.json();
      this.displayName = userInfo["DisplayName"];
      this.subscribe();
    },
    handleUpdate(event) {
      if (event.event == 'reload') {
        this.isNewMessage = false;
      }
    }
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