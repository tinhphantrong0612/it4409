<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm nhà cung cấp</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Tên nhà cung cấp</label>
                <input
									id="inpName"
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.displayName"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
								<label for="inpAddress" class="x-label">Địa chỉ</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.address"
                  maxlength="200"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
								<label for="inpPhone" class="x-label">Số điện thoại</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.phone"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
								<label for="inpEmail" class="x-label">Email</label>
                <input
									id="inpEmail"
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.email"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
								<label for="inpMoreInfo" class="x-label">Thông tin thêm</label>
                <input
									id="inpMoreInfo"
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.moreInfo"
                  maxlength="200"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Hủy</button>
          <button class="x-btn x-btn-primary" @click="save()">Thêm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplierAdd",
  props: ["show"],
  data() {
    return {
      supplierDetail: {
        displayName: "",
        address: "",
        phone: "",
        email: "",
        moreInfo: "",
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
      const response = await fetch(`${this.$currentOrigin}/api/supplier`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.supplierDetail),
      });
      const data = await response.text();
      if (response.status == 400) {
        this.errorMessage = data;
        this.$store.action.hideLoading();
        return;
      }
      this.$store.action.hideLoading();
      this.$emit("save");
    },
  },
};
</script>