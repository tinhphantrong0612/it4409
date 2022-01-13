<template>
  <div class="x-modal">
    <div class="x-modal-dialog x-edit-import-info">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm thủ kho</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div v-if="userList.length > 0">
              <table class="x-table">
                <thead>
                  <th>Id người dùng</th>
                  <th>Tên người dùng</th>
                  <th>Tên đăng nhập</th>
                  <th>Chức năng</th>
                </thead>
                <tbody>
                  <tr v-for="user in userList" :key="user.Id">
                    <td>{{ user.Id }}</td>
                    <td>{{ user.DisplayName }}</td>
                    <td>{{ user.Username }}</td>
                    <td>
                      <button
                        class="x-btn x-btn-primary m-1"
                        @click="addUserIntoStorage(user.Id)"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="userList.length == 0">
              Danh sách người dùng không thuộc nhà kho này rỗng
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
  name: "ImportInfoDetail",
  props: ["selectedStorageId"],
  data() {
    return {
      userList: [],
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getUserList() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      const response = await fetch(
        `http://localhost:3000/api/storage/nonuser/${this.selectedStorageId}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$emit("error", this.errorMessage);
      } else this.userList = await response.json();
      this.$store.action.hideLoading();
    },
    async addUserIntoStorage(userId) {
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/storage/${this.selectedStorageId}/user/${userId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 400) {
        await this.getUserList();
        this.errorMessage = await response.text();
      } else {
        await this.getUserList();
        this.successMessage = await response.text();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getUserList();
  },
};
</script>