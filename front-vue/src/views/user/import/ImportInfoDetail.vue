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
            <div class="x-row justify-content-start">
              <label for="" class="x-label x-col x-col-3">Mặt hàng</label>
                <div class="x-col x-col-9">{{importInfo.ObjectName}}</div>
            </div>
            <div class="x-row justify-content-start"><label for="" class="x-label x-col x-col-3">Đơn vị</label>
                <div class="x-col x-col-9">{{importInfo.UnitName}}</div></div>
            <div class="x-row justify-content-start"><label for="" class="x-label x-col x-col-3">Ngày nhập</label>
                      <div class="x-col x-col-9">{{$utils.toDDMMYYYY(importInfo.ImportDate)}}</div></div>
            <div class="x-row justify-content-start"> <label for="" class="x-label x-col x-col-3">Khách hàng</label>
                      <div class="x-col x-col-9">{{importInfo.SupplierName}}</div></div>
            <div class="x-row">
                <label for="" class="x-label x-col x-col-3 justify-content-center">Số lượng nhập
                    
                </label>
                <input type="number" min="1" v-model="importInfo.Amount" class="x-input x-col x-col-9">
            </div>
            <div class="x-row">
                <label for="" class="x-label x-col x-col-3 justify-content-center">Giá nhập
                </label>
                <input type="number" min="0" v-model="importInfo.ImportPrice" class="x-input x-col x-col-9">
            </div>
            <div class="x-row">
                <label for="" class="x-label x-col x-col-3 justify-content-center">Barcode
                </label>
                <input type="number" min="0" v-model="importInfo.Barcode" class="x-input x-col x-col-9">
            </div>
            <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
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
        ObjectId: ""
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
      const response = await fetch(`${this.$currentOrigin}/api/importInfo/${this.selectedImportInfoId}`, {
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
        `${this.$currentOrigin}/api/importInfo/${this.selectedImportInfoId}`, {
          credentials: 'include',
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$emit("error", this.errorMessage);
      } else this.importInfo = await response.json();
      this.$store.action.hideLoading();
    }
  },
  created() {
    this.getImportInfoDetail();
  },
};
</script>