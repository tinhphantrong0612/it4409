<template>
  <div class="x-modal" id="modalEdit">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm tài khoản quản trị viên</div>
          <button class="xi xi-close" @click="close"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <form class="x-col x-col-12">
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
                <label for="" class="x-label">Tài khoản</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  autocomplete="username"
                  v-model="newAdminDetails.username"
                  maxlength="200"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
                <label for="inpPhone" class="x-label">Mật khẩu</label>
                <input
                  type="password"
                  autocomplete="new-password"
                  class="x-input x-input-100"
                  v-model="newAdminDetails.password"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
              </form>
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
          <button class="x-btn x-btn-secondary" @click="close">Hủy</button>
          <button
            class="x-btn x-btn-primary"
            @click="
              $event.preventDefault();
              add();
            "
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAdminAdd",
  data() {
    return {
      newAdminDetails: {
        username: "",
        password: "",
        displayName: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
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
      this.$emit("save");
      this.$store.action.hideLoading();
    },
  },
};
</script>