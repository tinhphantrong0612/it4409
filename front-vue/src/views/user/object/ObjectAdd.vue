<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm mặt hàng</div>
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
          </div>
          <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
          }}</span>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Đóng</button>
          <button class="x-btn x-btn-primary" @click="save()">Thêm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectAdd",
  props: ["unitList"],
  data() {
    return {
      objectDetail: {
        DisplayName: "",
        UnitId: "",
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
      const response = await fetch(`${this.$currentOrigin}/api/object`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(this.objectDetail),
      });
      const data = await response.text();
      if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = data;
        return;
      }
      this.$store.action.showLoading();
      console.log(data);
      this.$emit("save");
    },
  },
  created() {
      this.objectDetail.UnitId = this.unitList[0].Id;
  }
};
</script>