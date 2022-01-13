<template>
  <div class="x-header">
    <div class="x-app-name">
      <div class="xi xi-list xi-size-x2" v-if="this.showNavbarIcon" @click="clickNavbar()"></div>
      Quản lý các kho hàng
    </div>
    <div class="x-header-control">
      <div class="x-user">Greetings, {{this.displayName}}</div>
      <div class="x-func xi xi-dropdown xi-size-125"></div>
      <button class="x-btn x-btn-danger" @click="logout()">Đăng xuất</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheAdminHeader",
  props: {
    displayName: String,
    showNavbarIcon: Boolean
  },
  methods: {
    async logout() {
      this.$store.action.showLoading();
      let response = await fetch(`http://localhost:3000/user/logout`, {
        credentials: "include",
      });
      let data = await response.text();
      console.log(data);
      this.$store.action.hideLoading();
      this.$router.push("/authorize");
    },
  },
};
</script>