<template>
  <div class="x-navbar">
    <router-link class="x-navbar-item" to="/storage" @click="$emit('switch-view', 'storage')">
      <div class="xi xi-storage xi-size-x2"></div>
      <span v-if="this.viewState != 2">Kho hàng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/user" @click="$emit('switch-view', 'user')">
      <div class="xi xi-user xi-size-x2"></div>
      <span v-if="this.viewState != 2">Người dùng</span>
    </router-link>
    <router-link class="x-navbar-item" to="/message" @click="$emit('switch-view', 'message')">
      <div class="xi xi-message xi-size-x2" style="position: relative;">
        <div class="notify-red" v-show="isNewMessage"></div>
      </div>
      <span v-if="this.viewState != 2">Tin nhắn</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TheAdminNavbar",
  props: ["show", "viewState", "isNewMessage"],
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


<style scoped>
.notify-red {
  background-color: red;
  width: 6px;
  height: 6px;
  position: absolute;
  border-radius: 50%;
  top: -2px;
  right: -2px;
}
</style>