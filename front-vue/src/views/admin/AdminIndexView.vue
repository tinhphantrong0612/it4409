<template>
  <div class="no-line-break">
    <the-admin-header
      :showNavbarIcon="this.viewState"
      :displayName="this.displayName"
      @click="showNav = !showNav"
    >
    </the-admin-header>
    <the-admin-navbar
      :show="this.showNav"
      :isNewMessage="this.isNewMessage"
      :viewState="this.viewState"
      @switch-view="currentView = $event"
    >
    </the-admin-navbar>
    <the-admin-content @update="handleUpdate($event)"></the-admin-content>
    <div class="x-spinner" v-show="isAdminSignupShow">
      <div class="storage-select-container">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm tài khoản quản trị viên</div>
          <button
            class="xi xi-close"
            @click="isAdminSignupShow = false"
          ></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Tên quản trị viên</label>
                <input
                  id="inpName"
                  type="text"
                  class="x-input x-input-100"
                  v-model="newAdminDetails.displayName"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
                <label for="inpAddress" class="x-label">Tài khoản</label>
                <input
                  id="inpAddress"
                  type="text"
                  class="x-input x-input-100"
                  v-model="newAdminDetails.username"
                  maxlength="200"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
                <label for="inpPhone" class="x-label">Mật khẩu</label>
                <input
                  id="inpPhone"
                  type="password"
                  class="x-input x-input-100"
                  v-model="newAdminDetails.password"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
              </div>
            </div>
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
          <span class="x-label-success" v-show="successMessage != ''">{{
            successMessage
          }}</span>
        </div>
        <div class="x-modal-footer">
          <button
            class="x-btn x-btn-secondary"
            @click="isAdminSignupShow = false"
          >
            Đóng
          </button>
          <button class="x-btn x-btn-primary" @click="add()">Thêm</button>
        </div>
      </div>
    </div>
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
      currentView: "storage",
      isAdminSignupShow: false,
      errorMessage: "",
      successMessage: "",
      newAdminDetails: {
        username: "",
        password: "",
        displayName: "",
      },
    };
  },
  watch: {
    viewState: function () {
      if (this.viewState == 0) {
        this.showNav = true;
      }
    },
  },
  methods: {
    handleView() {
      if (window.innerWidth <= 1200) {
        if (window.innerWidth <= 800) {
          this.viewState = 2;
        } else {
          this.viewState = 1;
        }
      } else {
        this.viewState = 0;
      }
    },
    async subscribe() {
      let response = await fetch(
        `${this.$currentOrigin}/api/message/subscribe`,
        {
          credentials: "include",
        }
      );
      if (response.status == 502) {
        // Time out
        this.subscribe();
      } else if (response.status != 200) {
        this.errorMessage = response.statusText;
        console.log(response.statusText);
        await Promise((resolve) => setTimeout(resolve, 1000));
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
      if (event.event == "reload") {
        this.isNewMessage = false;
      }
    },
    async add() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      let response = await fetch(`${this.$currentOrigin}/user/register`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.newAdminDetails),
      });
      if (response.status == 400) {
        this.errorMessage = await response.text();
      } else {
        this.successMessage = await response.text();
        this.newAdminDetails = {
          username: "",
          password: "",
          displayName: "",
        };
      }
      this.$store.action.hideLoading();
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