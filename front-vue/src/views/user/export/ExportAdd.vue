<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog x-table-modal">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Xuất hàng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Khách hàng</label>
                <select name="" id="" class="x-input" v-model="newExport.customerId">
                  <option
                    v-for="customer in customerList"
                    :key="customer.Id"
                    :value="customer.Id"
                  >
                    {{ customer.DisplayName }}
                  </option>
                </select>
                <div>
                  <table class="x-table x-input-table">
                    <thead>
                      <tr>
                        <th>Mặt hàng</th>
                        <th>Số lượng</th>
                        <th>Giá xuất</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(ExportInfo, index) in newExport.ExportInfoList"
                        :key="index"
                      >
                        <td>
                          <select
                            name=""
                            id=""
                            class="x-input"
                            v-model="ExportInfo.ObjectId"
                          >
                            <option
                              v-for="obj in objectList"
                              :value="obj.Id"
                              :key="obj.Id"
                            >
                              {{ obj.DisplayName }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            class="x-input x-input-table"
                            v-model="ExportInfo.Amount"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name=""
                            min="0"
                            class="x-input x-input-table"
                            v-model="ExportInfo.ExportPrice"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
                <button
                  class="x-btn x-btn-primary xi xi-add xi-size-150 w-100"
                  @click="add()"
                ></button>
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
  name: "ExportAdd",
  props: ["show", "customerList", "objectList"],
  data() {
    return {
      newExport: {
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
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    add() {
      let ExportInfoListSize = this.newExport.ExportInfoList.length;
      let lastExportInfo =
        this.newExport.ExportInfoList[ExportInfoListSize - 1];
      if (ExportInfoListSize == 5) {
        this.errorMessage = "Mỗi đơn hàng chỉ có thể nhập tối đa 5 mặt hàng";
        return;
      } else if (
        !lastExportInfo.ObjectId ||
        isNaN(Number(lastExportInfo.Amount)) ||
        isNaN(Number(lastExportInfo.ExportPrice)) ||
        !/^\d+$/.test(lastExportInfo.Barcode)
      ) {
        this.errorMessage =
          "Cần nhập đúng các dòng phía trước, barcode phải có dạng số";
      } else
        this.newExport.ExportInfoList.push({
          ObjectId: this.objectList[0].Id,
          Amount: 1,
          ExportPrice: 0,
        });
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(`http://localhost:3000/api/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.pruneExport()),
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
    pruneExport() {
      let standardizedExport = {};
      standardizedExport.CustomerId = this.newExport.CustomerId;
      standardizedExport.ExportInfoList = [];
      this.newExport.ExportInfoList.forEach((e) => {
        if (
          !(
            !e.ObjectId ||
            isNaN(Number(e.Amount)) ||
            isNaN(Number(e.ExportPrice))
          )
        ) {
          standardizedExport.ExportInfoList.push(e);
        }
      });
      return standardizedExport;
    },
  },
  created() {
    this.newExport.CustomerId = this.customerList[0]?.Id;
    this.newExport.ExportInfoList[0].ObjectId = this.objectList[0]?.Id;
  },
};
</script>