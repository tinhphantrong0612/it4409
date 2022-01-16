<template>
  <div class="x-modal">
    <div class="x-modal-dialog x-table-modal">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin xuất hàng</div>
          <button class="xi xi-close" id="close-btn" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Khách hàng</label>
                <select
                  name=""
                  id=""
                  class="x-input"
                  v-model="theExport.CustomerId"
                >
                  <option
                    v-for="Customer in customerList"
                    :key="Customer.Id"
                    :value="Customer.Id"
                  >
                    {{ Customer.DisplayName }}
                  </option>
                </select>
                <div>
                  <table class="x-table x-input-table">
                    <thead>
                      <tr>
                        <th>Mặt hàng</th>
                        <th>Số lượng</th>
                        <th>Giá xuất</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(ExportInfo, index) in theExport.ExportInfoList"
                        :key="index"
                      >
                        <td class="">
                          {{ ExportInfo.ObjectName }}
                        </td>
                        <td class="text-right">
                          {{ ExportInfo.Amount }}
                        </td>
                        <td>
                          {{ $utils.toVND(ExportInfo.ExportPrice) }}
                        </td>
                        <td>
                          <button
                            class="x-btn x-btn-danger xi xi-close xi-size-150"
                            @click="remove(ExportInfo.Id)"
                          ></button>
                          <button
                            class="x-btn x-btn-primary xi xi-edit xi-size-150"
                            @click="edit(ExportInfo.Id)"
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
          <button class="x-btn x-btn-secondary" id="cancel-btn" @click="close()">Hủy</button>
          <button class="x-btn x-btn-primary" @click="save()">Lưu</button>
        </div>
      </div>
    </div>
    <Export-info-detail
      :selectedExportInfoId="selectedExportInfoId"
      v-if="ExportInfoPopupShow"
      @save="
        selectedExportInfoId = '';
        ExportInfoPopupShow = false;
        disableClose();
        getExportDetail();
      "
      @error="
        selectedExportInfoId = '';
        getExportDetail();
        ExportInfoPopupShow = false;
        popupErrorMessage = $event;
      "
      @close="
        selectedExportInfoId = '';
        ExportInfoPopupShow = false;
      "
    ></Export-info-detail>
    <base-inform-popup
      v-show="popupErrorMessage != ''"
      :message="popupErrorMessage"
      @close="popupErrorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import ExportInfoDetail from "./ExportInfoDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";

export default {
  name: "ExportDetail",
  props: ["show", "customerList", "selectedExportId"],
  components: {
    ExportInfoDetail,
    BaseInformPopup,
  },
  data() {
    return {
      theExport: {
        CustomerId: "",
        ExportInfoList: [
          {
            ObjectId: "",
            Amount: 1,
            ExportPrice: 0
          },
        ],
      },
      errorMessage: "",
      popupErrorMessage: "",
      selectedExportInfoId: "",
      ExportInfoPopupShow: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    disableClose() {
      document.getElementById("cancel-btn").style.display = "none"
      document.getElementById("close-btn").style.display = "none"
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/export/${this.selectedExportId}`,
        {
          credentials: 'include',
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.theExport),
        }
      );
      const data = await response.text();
      if (response.status == 400) {
        this.errorMessage = data;
      } else this.$emit("save");
      this.$store.action.hideLoading();
    },
    async getExportDetail() {
      this.$store.action.showLoading();
      this.errorMessage = '';
      const response = await fetch(
        `${this.$currentOrigin}/api/export/${this.selectedExportId}`,
        {
          credentials: 'include'
        }
      );
      if (response.status == 500) {
        this.$emit("error", "Lỗi Server");
      } else if (response.status == 204) {
        this.$emit(
          "error",
          "Không tìm thấy đơn nhập yêu cầu, có thể đã bị xóa"
        );
      } else {
        this.theExport = await response.json();
      }
      this.$store.action.hideLoading();
    },
    async remove(ExportInfoId) {
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/exportInfo/${ExportInfoId}`,
        {
          credentials: 'include',
          method: "DELETE",
        }
      );
      if (response.status == 400) {
        this.errorMessage = await response.text();
      }
      await this.getExportDetail();
    },
    edit(ExportInfoId) {
      this.selectedExportInfoId = ExportInfoId;
      this.ExportInfoPopupShow = true;
    }
  },
  watch: {
    show: async function () {
      if (this.show) {
        await this.getExportDetail();
      }
    },
  },
};
</script>