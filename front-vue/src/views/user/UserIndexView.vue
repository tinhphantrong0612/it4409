<template>
  <div>
    <the-user-header></the-user-header>
    <the-user-navbar></the-user-navbar>
    <the-user-content></the-user-content>
    <div class="x-spinner" v-show="storageId == ''">
      <div class="storage-select-container">
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
          <div>
            Tài khoản chưa được liên kết với kho hàng nào, vui lòng liên hệ quản
            trị viên
          </div>
        </div>
        <span class="x-label-error" v-show="errorMessage != ''">{{
          errorMessage
        }}</span>
        <div>
          <button class="x-btn x-btn-danger" @click="logout()">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheUserHeader from "../../components/layout/user/TheUserHeader.vue";
import TheUserNavbar from "../../components/layout/user/TheUserNavbar.vue";
import TheUserContent from "../../components/layout/user/TheUserContent.vue";

import { store } from "../../script/store";

export default {
  name: "UserIndexView",
  components: {
    TheUserHeader,
    TheUserNavbar,
    TheUserContent,
  },
  data() {
    return {
      storageId: "",
      storedState: store.state,
      storageList: [],
      errorMessage: "",
    };
  },
  watch: {
    storageId: function() {
      if (this.storageId != '') {
        this.setStorageId();
      }
    }
  },
  methods: {
    async getUserStorageList() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      let response = await fetch(`http://localhost:3000/api/storage`, {
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
      let response = await fetch(`http://localhost:3000/user/logout`, {
        credentials: "include",
      });
      let data = await response.text();
      console.log(data);
      this.$store.action.hideLoading();
      this.$router.push("/authorize");
    },
    async setStorageId() {
      this.$store.action.showLoading();
      if (this.storageId == "") {
        this.errorMessage = "Chưa chọn nhà kho";
        this.$store.action.showLoading();
      } else {
        let response = await fetch(`http://localhost:3000/user/storageid`, {
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
          this.$store.action.hideLoading();
          this.$router.push("/object");
        }
      }
    },
  },
  created() {
    this.getUserStorageList();
  },
};
</script>