<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thêm đơn vị</div>
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
                  v-model="DisplayName"
                  maxlength="100"
                  :title="errorMessage"
                  :class="{ 'x-input-error': errorMessage != '' }"
                />
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Close</button>
          <button class="x-btn x-btn-primary" @click="save()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UnitAdd",
  props: ["show"],
  data() {
    return {
      DisplayName: "",
      errorMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async save() {
      this.$store.action.showLoading();
      const response = await fetch(`http://localhost:3000/api/unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ DisplayName: this.DisplayName }),
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
  },
};
</script>