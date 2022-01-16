<template>
  <div class="x-modal" id="modalAdd">
    <div class="x-modal-dialog" style="max-width: 800px">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Tin nhắn</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                <div class="x-row">
                    <div class="x-col x-col-12">
                        <div class="x-row">
                            <div class="x-col x-col-3">
                                <label for="" class="x-label">Người gửi:</label>
                            </div>
                            <div class="x-col x-col-9">{{message.UserDisplayName}}</div>
                        </div>
                        <div class="x-row">
                            <div class="x-col x-col-3">
                                <label for="" class="x-label">Lúc: </label>
                            </div>
                            <div class="x-col x-col-9">{{$utils.toHHMMDDMMYYYY(message.SentAt)}}</div>
                        </div>
                        <div class="x-row">
                            <div class="x-col x-col-3">
                                <label for="" class="x-label">Trạng thái</label>
                            </div>
                            <div class="x-col x-col-9">{{statusToText(message.MessageStatus, message.ResponseStatus)}}</div>
                        </div>
                        <div class="x-row">
                            <div class="x-col x-col-3">
                                <label for="" class="x-label">Tin nhắn</label>
                            </div>
                            <div class="x-col x-col-9">{{message.Message}}</div>
                        </div>
                        <div class="x-row">
                            <div class="x-col x-col-3">
                                <label for="" class="x-label">Phản hồi</label>
                            </div>
                            <div class="x-col x-col-9">{{message.Response}}</div>
                        </div>
                    </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageDetails",
  props: ['selectedMessageId'],
  data() {
    return {
      message: {},
      errorMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getMessageDetails() {
        this.$store.action.showLoading();
        let response = await fetch(`${this.$currentOrigin}/api/message/${this.selectedMessageId}`, {
            credentials: 'include'
        })
        if (response.status > 300) {
            this.errorMessage = await response.text();
        } else if (response.status == 204) {
            this.errorMessage = "Không tìm thấy tin nhắn";
        } else {
            this.message = await response.json();
        }
        this.$store.action.hideLoading();
    },
    statusToText(messageStatus, responseStatus) {
      if (messageStatus == 1 && responseStatus == 0) {
        return "Đã gửi";
      } else if (messageStatus == 2 && responseStatus == 0) {
        return "Đã đọc";
      } else if (responseStatus == 1) {
        return "Phản hồi mới";
      } else {
        return "Đã phản hồi";
      }
    },
  },
  created() {
      this.getMessageDetails();
  },
};
</script>