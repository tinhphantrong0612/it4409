<template>
  <div class="x-modal" id="modalEdit">
    <div
      class="x-modal-dialog"
      :class="{ 'x-table-modal': userDetail.Role == 1 }"
    >
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin người dùng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <label for="inpName" class="x-label x-col x-col-4"
                >Tên người dùng</label
              >
              <div class="x-col x-col-8">{{ userDetail.DisplayName }}</div>
            </div>
            <div class="x-row justify-content-center">
              <label for="inpName" class="x-label x-col x-col-4"
                >Tên tài khoản</label
              >
              <div class="x-col x-col-8">{{ userDetail.Username }}</div>
            </div>
            <div class="x-row justify-content-center">
              <label for="inpName" class="x-label x-col x-col-4">Vị trí</label>
              <div class="x-col x-col-8">
                {{ $utils.toRoleName(userDetail.Role) }}
              </div>
            </div>
            <div
              class="x-row justify-content-center"
              v-if="userDetail.Role == 1"
            >
              <table class="x-table x-input-table">
                <thead>
                  <tr>
                    <th>Tên kho</th>
                    <th>Địa chỉ</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="storage in userDetail.storages" :key="storage.Id">
                    <td>
                      {{ storage.DisplayName }}
                    </td>
                    <td>
                      {{ storage.Address }}
                    </td>
                    <td>
                      <button
                        class="x-btn x-btn-danger xi xi-close xi-size-150"
                        @click="remove(storage.Id)"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              v-if="userDetail.Role == 1"
              colspan="3"
              class="x-btn w-100 x-btn-primary text-center"
              @click="userAddStorageShow = true"
            >
              Thêm kho hàng
            </button>
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
          <span class="x-label-success" v-show="successMessage != ''">{{
            successMessage
          }}</span>
        </div>
        <div class="x-modal-footer justify-content-between">
          <div class="x-right-side">
            <button class="x-btn x-btn-success" @click="setAdmin()">Giao quyền quản trị</button>
          </div>
          <div class="x-left-side">
            <button class="x-btn x-btn-secondary" @click="close()">Đóng</button>
          </div>
        </div>
      </div>
    </div>
    <user-add-storage
      v-if="userAddStorageShow"
      :selectedUserId="selectedUserId"
      @close="
        userAddStorageShow = false;
        getUserDetail();
      "
    ></user-add-storage>
  </div>
</template>

<script>
import UserAddStorage from "./UserAddStorage.vue";

export default {
  name: "UserDetail",
  props: ["show", "selectedUserId"],
  components: {
    UserAddStorage,
  },
  data() {
    return {
      userDetail: {
        DisplayName: "",
        Username: "",
        Role: 0,
      },
      userAddStorageShow: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getUserDetail() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      const response = await fetch(
        `${this.$currentOrigin}/user/${this.selectedUserId}`,
        { credentials: "include" }
      );
      this.userDetail = await response.json();
      this.$store.action.hideLoading();
    },
    async setAdmin() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      const response = await fetch(
        `${this.$currentOrigin}/user/setAdmin/${this.selectedUserId}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      } else if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = await response.text();
      } else {
        this.$store.action.hideLoading();
        await this.getUserDetail();
        this.$emit("set-admin");
        this.successMessage = await response.text();
      }
    },
    async remove(storageId) {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      const response = await fetch(
        `${this.$currentOrigin}/api/storage/${storageId}/user/${this.selectedUserId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status >= 400) {
        await this.getUserDetail();
        this.errorMessage = await response.text();
      } else {
        await this.getUserDetail();
        this.successMessage = await response.text();
      }
      this.$store.action.hideLoading();
    },
  },
  watch: {
    show: async function () {
      if (this.show) {
        await this.getUserDetail();
      }
    },
  },
};
</script>