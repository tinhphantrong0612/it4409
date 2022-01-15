<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog" style="max-width: 800px">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Tin nhắn mới</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <textarea name="message" v-model="message" cols="30" rows="5" maxlength="255"></textarea>
                <span class="x-label-error" v-show="errorMessage != ''">{{
                  errorMessage
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-secondary" @click="close()">Hủy</button>
          <button class="x-btn x-btn-primary" @click="send()">Gửi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageAdd",
  props: ["show"],
  data() {
    return {
      message: "",
      errorMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async send() {
        this.$store.action.showLoading();
        if (!this.message || !this.message.trim()) {
            this.errorMessage = "Không được bỏ trống tin nhắn";
            this.$store.action.hideLoading();
            return;
        }
        let response = await fetch(`${this.$currentOrigin}/api/message`, {
            credentials: 'include',
            method: "POST",
            headers: {
                'Content-Type': "Application/json"
            },
            body: JSON.stringify({
                Message: this.message.trim()
            })
        })
        if (response.status > 300) {
            this.errorMessage = await response.text();
        } else {
            this.close();
        }
        this.$store.action.hideLoading();
    }
  },
};
</script>