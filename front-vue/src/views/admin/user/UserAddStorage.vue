<template>
  <div class="x-modal">
    <div class="x-modal-dialog x-edit-import-info">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm kho</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div v-if="storageList.length > 0">
              <table class="x-table">
                <thead>
                  <th>Tên nhà kho</th>
                  <th>Địa chỉ</th>
                  <th>Chức năng</th>
                </thead>
                <tbody>
                  <tr v-for="storage in storageList" :key="storage.Id">
                    <td>{{ storage.DisplayName }}</td>
                    <td>{{ storage.Address }}</td>
                    <td>
                      <button
                        class="x-btn x-btn-primary m-1"
                        @click="addStorageIntoUser(storage.Id)"
                      >
                        Thêm
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="storageList.length == 0">
              Danh sách nhà kho không quản lý bởi người dùng này rỗng
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
          <button class="x-btn x-btn-secondary" @click="close()">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["selectedUserId"],
  data() {
    return {
      storageList: [],
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getStorageList() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      const response = await fetch(
        `${this.$currentOrigin}/user/nonstorage/${this.selectedUserId}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$emit("error", this.errorMessage);
      } else this.storageList = await response.json();
      this.$store.action.hideLoading();
    },
    async addStorageIntoUser(storageId) {
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/storage/${storageId}/user/${this.selectedUserId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 400) {
        await this.getStorageList();
        this.errorMessage = await response.text();
      } else {
        await this.getStorageList();
        this.successMessage = await response.text();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getStorageList();
  },
};
</script>