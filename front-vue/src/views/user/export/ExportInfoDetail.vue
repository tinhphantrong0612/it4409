<template>
  <div class="x-modal">
    <div class="x-modal-dialog"> 
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin mặt hàng xuất</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-start">
              <label for="" class="x-label x-col x-col-3">Mặt hàng</label>
                <div class="x-col x-col-9">{{exportInfo.ObjectName}}</div>
            </div>
            <div class="x-row justify-content-start"><label for="" class="x-label x-col x-col-3">Đơn vị</label>
                <div class="x-col x-col-9">{{exportInfo.UnitName}}</div></div>
            <div class="x-row justify-content-start"><label for="" class="x-label x-col x-col-3">Ngày xuất</label>
                      <div class="x-col x-col-9">{{$utils.toDDMMYYYY(exportInfo.ExportDate)}}</div></div>
            <div class="x-row justify-content-start"> <label for="" class="x-label x-col x-col-3">Khách hàng</label>
                      <div class="x-col x-col-9">{{exportInfo.CustomerName}}</div></div>
            <div class="x-row">
                <label for="" class="x-label x-col x-col-3 justify-content-center">Số lượng xuất
                    
                </label>
                <input type="number" min="1" v-model="exportInfo.Amount" class="x-input x-col x-col-9">
            </div>
            <div class="x-row">
                <label for="" class="x-label x-col x-col-3 justify-content-center">Giá xuất
                </label>
                <input type="number" min="0" v-model="exportInfo.ExportPrice" class="x-input x-col x-col-9">
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
  name: "ExportInfoDetail",
  props: ["selectedExportInfoId"],
  data() {
    return {
      exportInfo: { // ?ObjectId
        ObjectName: "",
        ExportPrice: 0,
        Amount: 1,
        ExportDate: new Date(),
        CustomerName: "",
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
      const response = await fetch(`${this.$currentOrigin}/api/exportInfo/${this.selectedExportInfoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(this.exportInfo),
      });
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$store.action.hideLoading();
      } else {
        this.$emit("save");
      }
    },
    async getExportInfoDetail() {
      this.$store.action.showLoading();
      this.errorMessage = '';
      const response = await fetch(
        `${this.$currentOrigin}/api/exportInfo/${this.selectedExportInfoId}`,
        {credentials: 'include'}
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
        this.$emit("error", this.errorMessage);
      } else this.exportInfo = await response.json();
      this.$store.action.hideLoading();
    }
  },
  created() {
    this.getExportInfoDetail();
  },
};
</script>