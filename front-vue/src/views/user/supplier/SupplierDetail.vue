<template>
  <div class="x-modal" id="modalEdit">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin nhà cung cấp</div>
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
									id="inpAddress"
                  type="text"
                  class="x-input x-input-100"
                  v-model="supplierDetail.address"
                  maxlength="200"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
								<label for="inpPhone" class="x-label">Số điện thoại</label>
                <input
									id="inpPhone"
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
          <button
            class="x-btn x-btn-secondary"
            id="btnEditFooterClose"
            @click="close()"
          >
            Đóng
          </button>
          <button class="x-btn x-btn-primary" @click="save()">Sửa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplierDetail",
  props: ["show", "selectedSupplierId"],
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
      const response = await fetch(
        `http://localhost:3000/api/supplier/${this.selectedSupplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.supplierDetail),
        }
      );
      const data = await response.text();
      if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = data;
        return;
      }
      this.$store.action.hideLoading();
      this.$emit("save");
      this.$emit("close");
      console.log(data);
    },
  },
  watch: {
    show: async function () {
      if (this.show) {
        this.$store.action.showLoading();
        this.errorMessage = "";
        const response = await fetch(
          `http://localhost:3000/api/supplier/${this.selectedSupplierId}`
        );
        this.supplierDetail = await response.json();
        this.supplierDetail.moreInfo = this.supplierDetail.moreInfo === "null" ? '' : this.supplierDetail.moreInfo;
        this.$store.action.hideLoading();
      }
    },
  },
};
</script>