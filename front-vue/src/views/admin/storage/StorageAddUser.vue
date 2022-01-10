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
            <div
              class="x-btn x-btn-secondary w-100 m-1"
              v-for="user in userList"
              @click="addUserIntoStorage(user.Id)"
              :key="user.Id"
            >
              {{ user.DisplayName }}
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
        console.log(userId);
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/storage/user/${this.selectedStorageId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
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