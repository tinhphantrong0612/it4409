<template>
  <div class="x-modal">
    <div class="x-modal-dialog x-edit-import-info">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin mặt hàng nhập</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-6 p-1">
                  <div class="x-row justify-content-between">
                      <label for="" class="x-label">Mặt hàng</label>
                      <div>{{importInfo.ObjectName}}</div>
                  </div>
                  <div class="x-row justify-content-between">
                      <label for="" class="x-label">Đơn vị</label>
                      <div>{{importInfo.UnitName}}</div>
                  </div>
              </div>
              <div class="x-col x-col-6 p-1">
                  <div class="x-row justify-content-between">
                      <label for="" class="x-label">Ngày nhập</label>
                      <div>{{toDDMMYYYY(importInfo.ImportDate)}}</div>
                  </div>
                  <div class="x-row justify-content-between">
                      <label for="" class="x-label">Nhà cung cấp</label>
                      <div>{{importInfo.SupplierName}}</div>
                  </div>
              </div>
            </div>
            <div class="x-row">
                <label for="" class="x-label w-100">Số lượng nhập
                    <input type="number" min="1" v-model="importInfo.Amount" class="x-input w-100">
                </label>
            </div>
            <div class="x-row">
                <label for="" class="x-label w-100">Giá nhập
                    <input type="number" min="0" v-model="importInfo.ImportPrice" class="x-input w-100">
                </label>
            </div>
            <div class="x-row">
                <label for="" class="x-label w-100">Barcode
                    <input type="text" v-model="importInfo.Barcode" class="x-input w-100">
                </label>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Hủy</button>
          <button class="x-btn x-btn-primary" @click="save()">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImportInfoDetail",
  props: ["selectedImportInfoId"],
  data() {
    return {
      importInfo: {
        ObjectName: "",
        Barcode: "",
        ImportPrice: 0,
        Amount: 1,
        ImportDate: new Date(),
        SupplierName: "",
        UnitName: "",
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
      const response = await fetch(`http://localhost:3000/api/importInfo/${this.selectedImportInfoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(this.importInfo),
      });
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$store.action.hideLoading();
      } else {
        this.$emit("save");
      }
    },
    async getImportInfoDetail() {
      this.$store.action.showLoading();
      this.errorMessage = '';
      const response = await fetch(
        `http://localhost:3000/api/importInfo/${this.selectedImportInfoId}`, {
          credentials: 'include',
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$emit("error", this.errorMessage);
      } else this.importInfo = await response.json();
      this.$store.action.hideLoading();
    },
    toDDMMYYYY(date) {
      const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
  },
  created() {
    this.getImportInfoDetail();
  },
};
</script>