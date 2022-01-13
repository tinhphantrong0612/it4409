<template>
  <div class="x-navbar">
    <router-link class="x-navbar-item" to="/object">
      <div class="xi xi-package xi-size-x2"></div>
      <span v-if="this.viewState != 2">Mặt hàng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/unit">
      <div class="xi xi-scale xi-size-x2"></div>
      <span v-if="this.viewState != 2">Đơn vị</span>
    </router-link>
    <router-link class="x-navbar-item" to="/customer">
      <div class="xi xi-customer xi-size-x2"></div>
      <span v-if="this.viewState != 2">Khách hàng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/supplier">
      <div class="xi xi-supplier xi-size-x2"></div>
      <span v-if="this.viewState != 2">Nhà cung cấp</span>
    </router-link>
    <router-link class="x-navbar-item" to="/import">
      <div class="xi xi-import xi-size-x2"></div>
      <span v-if="this.viewState != 2">Nhập hàng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/export">
      <div class="xi xi-export xi-size-x2"></div>
      <span v-if="this.viewState != 2">Xuất hàng</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TheUserNavbar",
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