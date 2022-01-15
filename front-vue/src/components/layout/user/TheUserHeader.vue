<template>
  <div class="x-header">
    <div class="x-app-name">
      <div class="xi xi-list xi-size-x2" v-if="this.showNavbarIcon" @click="clickNavbar()"></div>
      Quản lý kho hàng
    </div>
    <div class="x-header-control">
      <div class="x-user" style='margin-right:10px; font-style: italic; align-self:center;'>Hello, {{this.displayName}} !</div>
      <dropdown-menu id="settings" :arrays="dropdownItems">
        <div style = "color: '#fff'" class="xi xi-dropdown" ></div>
        <div class="notify-red" v-show="isNewMessage"></div>
      </dropdown-menu>
    </div>
  </div>
</template>

<script>
import DropdownMenu from "../../../components/components/Dropdown/DropdownMenu.vue";

export default {
  components: { DropdownMenu },
  name: "TheUserHeader",
  props: {
    displayName: String,
    showNavbarIcon: Number,
    isNewMessage: Boolean
  },
  data() {
    return {
      dropdownItems: [
        {
          text: 'Chọn nhà kho',
          onClick: () => {
            this.$parent.storageId = '';
          },
        },
        {
          text: 'Liên hệ Admin',
          onClick: () => {
            this.$parent.isMessageListShow = true;
          }
        },
        {
          text: 'Đăng xuất',
          onClick: () => this.logout(),
        },
      ],
    };
  },
  methods: {
    clickNavbar() {
      this.$emit("click");
    },
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
  }
};
</script>

<style scoped>
.notify-red {
  background-color: red;
  width: 6px;
  height: 6px;
  position: absolute;
  border-radius: 50%;
  top: 8px;
  right: 8px;
}
</style>