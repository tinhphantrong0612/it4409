<template>
  <div class="x-modal" id="modalEdit">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin kho hàng</div>
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
            <div class="x-row justify-content-center">
              <div class="x-col x-col-4">
                <label for="" class="x-label">Số đơn xuất:</label>
              </div>
              <div class="x-col x-col-4">
                <label for="" class="x-label">Số đơn nhập:</label>
              </div>
              <div class="x-col x-col-4">
                <label for="" class="x-label">Số mặt hàng:</label>
              </div>
            </div>
            <div class="x-row justify-content-center">
              <div class="x-col x-col-4">{{ storageDetail.ExportCount }}</div>
              <div class="x-col x-col-4">{{ storageDetail.ImportCount }}</div>
              <div class="x-col x-col-4">{{ storageDetail.ObjectCount }}</div>
            </div>
            <div class="x-row justify-content-center">
              <table class="x-table x-input-table">
                <thead>
                  <tr>
                    <th>ID Thủ kho</th>
                    <th>Tên thủ kho</th>
                    <th>Tên đăng nhập</th>
                    <th>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in storageDetail.Users" :key="user.Id">
                    <td>
                      {{ user.Id }}
                    </td>
                    <td>
                      {{ user.DisplayName }}
                    </td>
                    <td>
                      {{ user.Username }}
                    </td>
                    <td>
                      <button
                        class="x-btn x-btn-danger xi xi-close xi-size-150"
                        @click="remove(User.Id)"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button class="x-btn w-100 x-btn-primary">Add</button>
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
        </div>
        <div class="x-modal-footer">
          <button
            class="x-btn x-btn-secondary"
            id="btnEditFooterClose"
            @click="close()"
          >
            Close
          </button>
          <button class="x-btn x-btn-primary" @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StorageDetail",
  props: ["show", "selectedStorageId", "unitList"],
  data() {
    return {
      storageDetail: {
        DisplayName: "",
        Address: "",
        Users: [],
        ExportCount: 0,
        ImportCount: 0,
        ObjectCount: 0,
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
        `http://localhost:3000/api/storage/${this.selectedStorageId}`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.storageDetail),
        }
      );
      const data = await response.text();
      if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = data;
        return;
      }
      this.$store.action.showLoading();
      this.$emit("save");
      this.$emit("close");
      console.log(data);
    },
    toVND(money) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(money);
    },
  },
  watch: {
    show: async function () {
      if (this.show) {
        this.$store.action.showLoading();
        this.errorMessage = "";
        const response = await fetch(
          `http://localhost:3000/api/storage/${this.selectedStorageId}`,
          {
            credentials: "include",
          }
        );
        this.storageDetail = await response.json();
        this.$store.action.hideLoading();
      }
    },
  },
};
</script>