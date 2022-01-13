<template>
  <div class="x-navbar">
    <router-link class="x-navbar-item" to="/storage">
      <div class="xi xi-storage xi-size-x2"></div>
      <span v-if="this.viewState != 2">Kho hàng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/message">
      <div class="xi xi-message xi-size-x2"></div>
      <span v-if="this.viewState != 2">Tin nhắn</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TheAdminNavbar",
  props: ["show", "viewState"],
  watch: {
    show: function () {
      if (this.show == true) {
        this.setShowNav();
      } else {
        this.setHideNav();
      }
    },
    viewState: function () {
      if (this.show == true) {
        this.setShowNav();
      }
    },
  },
  methods: {
    setShowNav() {
      if (this.viewState == 2)
        document
          .querySelector(":root")
          .style.setProperty("--x-navbar-width", "75px");
      else
        document
          .querySelector(":root")
          .style.setProperty("--x-navbar-width", "225px");
    },
    setHideNav() {
      document
        .querySelector(":root")
        .style.setProperty("--x-navbar-width", "0px");
    },
  },
  created() {
    if (this.show == true) {
      this.setShowNav();
    } else {
      this.setHideNav();
    }
  },
};
</script>