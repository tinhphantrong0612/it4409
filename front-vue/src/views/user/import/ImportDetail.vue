<template>
  <div class="x-modal">
    <div class="x-modal-dialog x-table-modal">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin nhập hàng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Nhà cung cấp</label>
                <select
                  name=""
                  id=""
                  class="x-input"
                  v-model="theImport.SupplierId"
                >
                  <option
                    v-for="supplier in supplierList"
                    :key="supplier.Id"
                    :value="supplier.Id"
                  >
                    {{ supplier.DisplayName }}
                  </option>
                </select>
                <div>
                  <table class="x-table x-input-table">
                    <thead>
                      <tr>
                        <th>Mặt hàng</th>
                        <th>Số lượng</th>
                        <th>Giá nhập</th>
                        <th>Barcode</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(importInfo, index) in theImport.ImportInfoList"
                        :key="index"
                      >
                        <td>
                          {{ importInfo.ObjectName }}
                        </td>
                        <td>
                          {{ importInfo.Amount }}
                        </td>
                        <td>
                          {{ importInfo.ImportPrice }}
                        </td>
                        <td>
                          {{ importInfo.Barcode }}
                        </td>
                        <td>
                          <button
                            class="x-btn x-btn-danger xi xi-close xi-size-150"
                            @click="remove(importInfo.Id)"
                          ></button>
                          <button
                            class="x-btn x-btn-primary xi xi-edit xi-size-150"
                            @click="edit(importInfo.Id)"
                          ></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Hủy</button>
          <button class="x-btn x-btn-primary" @click="save()">Lưu</button>
        </div>
      </div>
    </div>
    <import-info-detail
      :selectedImportInfoId="selectedImportInfoId"
      v-if="importInfoPopupShow"
      @save="
        selectedImportInfoId = '';
        importInfoPopupShow = false;
        getImportDetail();
      "
      @error="
        selectedImportInfoId = '';
        getImportDetail();
        importInfoPopupShow = false;
        popupErrorMessage = $event;
      "
      @close="
        selectedImportInfoId = '';
        importInfoPopupShow = false;
      "
    ></import-info-detail>
    <base-inform-popup
      v-show="popupErrorMessage != ''"
      :message="popupErrorMessage"
      @close="popupErrorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import ImportInfoDetail from "./ImportInfoDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";

export default {
  name: "ImportDetail",
  props: ["show", "supplierList", "selectedImportId"],
  components: {
    ImportInfoDetail,
    BaseInformPopup,
  },
  data() {
    return {
      theImport: {
        SupplierId: "",
        ImportInfoList: [
          {
            ObjectId: "",
            Amount: 1,
            ImportPrice: 0,
            Barcode: "",
          },
        ],
      },
      errorMessage: "",
      popupErrorMessage: "",
      selectedImportInfoId: "",
      importInfoPopupShow: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/import/${this.selectedImportId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },credentials: 'include',
          body: JSON.stringify(this.theImport),
        }
      );
      const data = await response.text();
      if (response.status == 400) {
        this.errorMessage = data;
      } else this.$emit("save");
      this.$store.action.hideLoading();
    },
    async getImportDetail() {
      this.$store.action.showLoading();
      this.errorMessage = '';
      const response = await fetch(
        `http://localhost:3000/api/import/${this.selectedImportId}`, {credentials: 'include',}
      );
      if (response.status == 500) {
        this.$emit("error", "Lỗi Server");
      } else if (response.status == 204) {
        this.$emit(
          "error",
          "Không tìm thấy đơn nhập yêu cầu, có thể đã bị xóa"
        );
      } else {
        this.theImport = await response.json();
      }
      this.$store.action.hideLoading();
    },
    async remove(importInfoId) {
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/importInfo/${importInfoId}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
      }
      await this.getImportDetail();
    },
    edit(importInfoId) {
      this.selectedImportInfoId = importInfoId;
      this.importInfoPopupShow = true;
    }
  },
  watch: {
    show: async function () {
      if (this.show) {
        await this.getImportDetail();
      }
    },
  },
};
</script>