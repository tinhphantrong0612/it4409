<template>
  <div class="x-header">
    <div class="x-app-name">
      <div class="xi xi-list xi-size-x2" v-if="this.showNavbarIcon" @click="clickNavbar()"></div>
      Quản lý các kho hàng
    </div>
    <div class="x-header-control">
      <div class="x-user" style='margin-right:10px; font-style: italic; align-self:center;'>Hello, {{this.displayName}} !</div>
      <dropdown-menu id="settings" :arrays="dropdownItems">
        <div style = "color: '#fff'" class="xi xi-dropdown" ></div>
      </dropdown-menu>
    </div>
  </div>
</template>

<script>
import DropdownMenu from "../../../components/components/Dropdown/DropdownMenu.vue";

export default {
  name: "TheAdminHeader",
  components: {DropdownMenu},
  props: {
    displayName: String,
    showNavbarIcon: Number
  },
  data() {
    return {
      dropdownItems: [
        {
          text: 'Đăng xuất',
          onClick: () => this.logout(),
        },
      ],
    }
  },
  methods: {
    async clickNavbar() {
      this.$emit("click");
    }
    async logout() {
      this.$store.action.showLoading();
      let response = await fetch(`${this.$currentOrigin}/user/logout`, {
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