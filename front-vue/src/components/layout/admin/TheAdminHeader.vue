<template>
  <div class="x-header">
    <div class="x-app-name">Quản lý kho hàng</div>
    <div class="x-header-control">
      <drop-down 
        :title="this.displayName"
        :items="this.items"
        @message="processMessage">
      </drop-down>
    </div>
  </div>
</template>

<script>
import DropDown from "../../components/DropDown.vue"

export default {
  name: "TheAdminHeader",
  components: {
    DropDown,
  },
  data() {
    return {
      items: [
        {
          message: "logout",
          name: "Đăng xuất",
        },
      ]
    }
  },
  props: {
    displayName: String,
    showNavbarIcon: Number
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
    processMessage(message) {
      if (message == "logout")
        this.logout();
    }
  },
};
</script>