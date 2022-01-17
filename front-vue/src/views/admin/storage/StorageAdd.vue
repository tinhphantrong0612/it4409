<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm kho hàng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Tên kho hàng</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  v-model="storageDetail.DisplayName"
                  maxlength="100"
                />
              </div>
            </div>
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Địa chỉ</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  v-model="storageDetail.Address"
                  maxlength="100"
                />
              </div>
            </div>
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Đóng</button>
          <button class="x-btn x-btn-primary" @click="save()">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StorageAdd",
  data() {
    return {
      storageDetail: {
        DisplayName: "",
        Address: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(`${this.$currentOrigin}/api/storage`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.storageDetail),
      });
      const data = await response.text();
      if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = data;
        return;
      }
      this.$store.action.showLoading();
      console.log(data);
      this.$emit("save");
    },
  },
  created() {
  }
};
</script>