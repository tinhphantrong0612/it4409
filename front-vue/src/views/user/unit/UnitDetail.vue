<template>
  <div class="x-modal" id="modalEdit">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông tin đơn vị</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <label for="inpName" class="x-label">Tên đơn vị</label>
                <input
                  type="text"
                  class="x-input x-input-100"
                  :class="{ 'x-input-error': errorMessage != '' }"
                  :title="errorMessage"
                  v-model="unitDetail.DisplayName"
                  maxlength="100"
                />
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
              </div>
            </div>
          </div>
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
  name: "UnitDetail",
  props: ["show", "selectedUnitId"],
  data() {
    return {
      unitDetail: {
        DisplayName: "",
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
        `http://localhost:3000/api/unit/${this.selectedUnitId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(this.unitDetail),
        }
      );
      const data = await response.text();
      if (response.status == 400) {
        this.$store.action.hideLoading();
        this.errorMessage = data;
        return;
      }
      this.$store.action.hideLoading();
      this.$emit("save");
      this.$emit("close");
      console.log(data);
    },
  },
  watch: {
    show: async function () {
      if (this.show) {
        this.$store.action.showLoading();
        this.errorMessage = "";
        const response = await fetch(
          `http://localhost:3000/api/unit/${this.selectedUnitId}`, {
            credentials: 'include',
          }
        );
        this.unitDetail = await response.json();
        this.$store.action.hideLoading();
      }
    },
  },
};
</script>