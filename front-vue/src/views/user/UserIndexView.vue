<template>
  <div class="no-line-break">
    <the-user-header
      :showNavbarIcon="this.viewState"
      :displayName="this.displayName"
      :isNewMessage="isNewMessage"
      @click="showNav = !showNav"
    >
    </the-user-header>
    <the-user-navbar :show="this.showNav" :viewState="this.viewState">
    </the-user-navbar>
    <the-user-content :storageId="currentStorageId"></the-user-content>
    <div class="x-spinner" v-show="storageId == '' && !isMessageListShow">
      <div class="storage-select-container">
        <div class="x-modal-header">
          <div class="x-modal-title">Chọn nhà kho</div>
        </div>
        <div class="x-modal-body">
          <select
            v-if="storageList.length != 0"
            name=""
            id=""
            class="x-input x-combobox w-100 storage-select"
            v-model="storageId"
          >
            <option
              :value="storage.Id"
              v-for="storage in storageList"
              :key="storage.Id"
            >
              {{ storage.DisplayName }}
            </option>
          </select>
          <div v-if="storageList.length == 0">
            <div style="white-space: break-spaces">
              Tài khoản chưa được liên kết với kho hàng nào, vui lòng liên hệ
              quản trị viên
            </div>
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
        </div>
        <div class="x-modal-footer">
          <button
            class="x-btn x-btn-secondary"
            @click="isMessageListShow = true"
          >
            Liên hệ quản trị viên
          </button>
          <button class="x-btn x-btn-danger" @click="logout()">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
    <message-list
      ref="messageList"
      v-if="isMessageListShow"
      @close="isMessageListShow = false"
    ></message-list>
  </div>
</template>

<script>
import TheUserHeader from "../../components/layout/user/TheUserHeader.vue";
import TheUserNavbar from "../../components/layout/user/TheUserNavbar.vue";
import TheUserContent from "../../components/layout/user/TheUserContent.vue";

import MessageList from "./message/MessageList.vue";

import { store } from "../../script/store";

export default {
  name: "UserIndexView",
  components: {
    TheUserHeader,
    TheUserNavbar,
    TheUserContent,
    MessageList,
  },
  data() {
    return {
      viewState: 0,
      showNav: true,
      storageId: "",
      displayName: "",
      storedState: store.state,
      storageList: [],
      errorMessage: "",
      isMessageListShow: false,
      isNewMessage: false,
      currentStorageId: "",
    };
  },
  watch: {
    storageId: function () {
      if (this.storageId != "") {
        this.setStorageId();
      }
    },
    viewState: function () {
      if (this.viewState == 0) {
        this.showNav = true;
      }
    },
    isMessageListShow: function () {
      if (this.isMessageListShow) {
        this.isNewMessage = false;
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
    async getUserInformation() {
      let response = await fetch(`${this.$currentOrigin}/user/login`, {
        credentials: "include",
      });
      var userInfo = await response.json();
      this.displayName = userInfo["DisplayName"];
      this.subscribe();
    },
    async getUserStorageList() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      let response = await fetch(`${this.$currentOrigin}/api/storage`, {
        credentials: "include",
      });
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      }
      this.storageList = await response.json();
      this.$store.action.hideLoading();
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
        console.log("New response");
        this.isNewMessage = true;
        if (this.isMessageListShow) {
          this.$refs.messageList.getMessageList();
          this.isNewMessage = false;
        }
        this.subscribe();
      }
    },
    async setStorageId() {
      this.$store.action.showLoading();
      if (this.storageId == "") {
        this.errorMessage = "Chưa chọn nhà kho";
        this.$store.action.showLoading();
      } else {
        let response = await fetch(`${this.$currentOrigin}/user/storageid`, {
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            storageId: this.storageId,
          }),
        });
        if (response.status == 400) {
          await this.getUserStorageList();
          this.errorMessage = await response.text();
        } else {
          this.currentStorageId = this.storageId;
          this.$store.action.hideLoading();
          if (this.$router.currentRoute.path != "/object")
            this.$router.replace("/object");
        }
      }
    },
  },
  created() {
    this.handleView();
    window.addEventListener("resize", this.handleView);
    this.getUserStorageList();
    this.getUserInformation();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleView);
  },
};
</script>