<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog x-table-modal">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Nhập hàng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Nhà cung cấp</label>
                <select name="" id="" class="x-input" v-model="newImport.SupplierId">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(importInfo, index) in newImport.ImportInfoList"
                        :key="index"
                      >
                        <td>
                          <select
                            name=""
                            id=""
                            class="x-input"
                            v-model="importInfo.ObjectId"
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
                            v-model="importInfo.Amount"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name=""
                            min="0"
                            class="x-input x-input-table"
                            v-model="importInfo.ImportPrice"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name=""
                            class="x-input x-input-table"
                            v-model="importInfo.Barcode"
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
  name: "ImportAdd",
  props: ["show", "supplierList", "objectList"],
  data() {
    return {
      newImport: {
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
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    add() {
      let importInfoListSize = this.newImport.ImportInfoList.length;
      let lastImportInfo =
        this.newImport.ImportInfoList[importInfoListSize - 1];
      if (importInfoListSize == 5) {
        this.errorMessage = "Mỗi đơn hàng chỉ có thể nhập tối đa 5 mặt hàng";
        return;
      } else if (
        !lastImportInfo.ObjectId ||
        isNaN(Number(lastImportInfo.Amount)) ||
        isNaN(Number(lastImportInfo.ImportPrice)) ||
        !/^\d+$/.test(lastImportInfo.Barcode)
      ) {
        this.errorMessage =
          "Cần nhập đúng các dòng phía trước, barcode phải có dạng số";
      } else
        this.newImport.ImportInfoList.push({
          ObjectId: this.objectList[0].Id,
          Amount: 1,
          ImportPrice: 0,
          Barcode: "",
        });
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(`${this.$currentOrigin}/api/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(this.pruneImport()),
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
    pruneImport() {
      let standardizedImport = {};
      standardizedImport.SupplierId = this.newImport.SupplierId;
      standardizedImport.ImportInfoList = [];
      this.newImport.ImportInfoList.forEach((e) => {
        if (
          !(
            !e.ObjectId ||
            isNaN(Number(e.Amount)) ||
            isNaN(Number(e.ImportPrice)) ||
            !/^\d+$/.test(e.Barcode)
          )
        ) {
          standardizedImport.ImportInfoList.push(e);
        }
      });
      return standardizedImport;
    },
  },
  created() {
    this.newImport.SupplierId = this.supplierList[0]?.Id;
    this.newImport.ImportInfoList[0].ObjectId = this.objectList[0]?.Id;
  },
};
</script>