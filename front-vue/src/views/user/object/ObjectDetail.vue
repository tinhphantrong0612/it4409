<template>
  <div class="x-modal" id="modalEdit">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin mặt hàng</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Tên mặt hàng</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  v-model="objectDetail.DisplayName"
                  maxlength="100"
                />
              </div>
            </div>
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Đơn vị</label>
                <select
                  type="text"
                  class="x-input x-input-100"
                  v-model="objectDetail.UnitId"
                >
                  <option
                    v-for="unit in unitList"
                    :value="unit.Id"
                    :key="unit.Id"
                  >
                    {{ unit.DisplayName }}
                  </option>
                </select>
              </div>
            </div>
            <div class="x-row justify-content-center">
              <div
                class="x-col x-col-4 justify-content-start"
                style="border-right: 1px solid var(--x-border-color)"
              >
                <div class="x-row">
                  <label for="inpName" class="pl-1 x-label x-col x-col-6"
                    >Đã nhập:</label
                  >
                  <div class="pr-1 x-col x-col-6 text-right">
                    {{ objectDetail.ImportAmount }}
                  </div>
                </div>
                <div class="x-row">
                  <label for="inpName" class="pl-1 x-label x-col x-col-6"
                    >Bán ra:
                  </label>
                  <div class="pr-1 x-col x-col-6 text-right">
                    {{ objectDetail.ExportAmount }}
                  </div>
                </div>
                <div class="x-row">
                  <label for="inpName" class="pl-1 x-label x-col x-col-6"
                    >Còn lại:
                  </label>
                  <div class="pr-1 x-col x-col-6 text-right">
                    {{ objectDetail.ImportAmount - objectDetail.ExportAmount }}
                  </div>
                </div>
              </div>
              <div class="x-col x-col-8 justify-content-start">
                <div class="x-col x-col-12 justify-content-start">
                  <div class="x-row">
                    <label for="inpName" class="pl-1 x-label x-col x-col-6"
                      >Chi phí mua vào:</label
                    >
                    <div class="x-col x-col-6 pr-1 text-right">
                      {{ toVND(objectDetail.ImportMoney) }}
                    </div>
                  </div>
                  <div class="x-row">
                    <label for="inpName" class="pl-1 x-label x-col x-col-6"
                      >Giá trị đã bán:</label
                    >
                    <div class="x-col x-col-6 pr-1 text-right">
                      {{ toVND(objectDetail.ExportMoney) }}
                    </div>
                  </div>
                  <div class="x-row">
                    <label for="inpName" class="pl-1 x-label x-col x-col-6"
                      >Thu về:</label
                    >
                    <div class="x-col x-col-6 pr-1 text-right">
                      {{ toVND(objectDetail.ImportMoney - objectDetail.ExportMoney) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            Hủy
          </button>
          <button class="x-btn x-btn-primary" @click="save()">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectDetail",
  props: ["show", "selectedObjectId", "unitList"],
  data() {
    return {
      objectDetail: {
        DisplayName: "",
        UnitId: "",
        ImportAmount: 0,
        ExportAmount: 0,
        ImportMoney: 0,
        ExportMoney: 0,
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
        `${this.$currentOrigin}/api/object/${this.selectedObjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(this.objectDetail),
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
      return this.$utils.toVND(money)
    }
  },
  watch: {
    show: async function () {
      if (this.show) {
        this.$store.action.showLoading();
        this.errorMessage = "";
        const response = await fetch(
          `${this.$currentOrigin}/api/object/${this.selectedObjectId}`,
          {credentials: 'include',}
        );
        this.objectDetail = await response.json();
        this.$store.action.hideLoading();
      }
    },
  },
};
</script>