<template>
  <div class="x-modal">
    <div class="x-modal-dialog" style="max-width: 600px">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Danh sách tin nhắn</div>
          <button class="xi xi-close" @click="close()"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <table class="x-table" v-if="messageList.length != 0">
                <thead>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                  <th>Nội dung</th>
                  <th>Chức năng</th>
                </thead>
                <tbody>
                  <tr v-for="message in messageList" :key="message.Id">
                    <td>{{ toHHMMDDMMYYYY(message.SentAt) }}</td>
                    <td>{{ statusToText(message.ResponseStatus) }}</td>
                    <td>{{ shortenMessage(message.Message) }}</td>
                    <td>
                      <button
                        class="x-btn x-btn-primary xi xi-edit xi-size-150"
                        @click="checkMessage(message.Id)"
                      ></button>
                      <button
                        class="x-btn x-btn-danger xi xi-close xi-size-150"
                        @click="deleteMessage(message.Id)"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="messageList.length == 0">
                Chưa có tin nhắn nào được gửi
              </div>
            </div>
            <span class="x-label-error" v-show="errorMessage != ''">{{
              errorMessage
            }}</span>
            <span class="x-label-success" v-show="successMessage != ''">{{
              successMessage
            }}</span>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-primary" @click="add()">Add</button>
          <button class="x-btn x-btn-secondary" @click="close()">Close</button>
        </div>
      </div>
    </div>
    <message-add
      v-if="messageAddShow"
      @close="
        messageAddShow = false;
        getMessageList();
      "
    ></message-add>
    <message-details
      v-if="selectedMessageId != 0"
      :selectedMessageId="selectedMessageId"
      @close="
        selectedMessageId = 0;
        getMessageList();
      "
    ></message-details>
  </div>
</template>

<script>
import MessageAdd from "./MessageAdd.vue";
import MessageDetails from "./MessageDetails.vue";

export default {
  name: "MessageList",
  components: {
    MessageAdd,
    MessageDetails,
  },
  data() {
    return {
      messageList: [],
      messageAddShow: false,
      selectedMessageId: 0,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    add() {
      this.messageAddShow = true;
    },
    checkMessage(id) {
      this.selectedMessageId = id;
    },
    async getMessageList() {
      this.$store.action.showLoading();
      this.errorMessage = "";
      this.successMessage = "";
      let response = await fetch(`http://localhost:3000/api/message`, {
        credentials: "include",
      });
      if (response.status == 400) {
        this.errorMessage = await response.text();
      } else {
        this.messageList = await response.json();
      }
      this.$store.action.hideLoading();
    },
    async deleteMessage(messageId) {
      this.$store.action.showLoading();
      let response = await fetch(
        `http://localhost:3000/api/message/${messageId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        await this.getMessageList();
        this.errorMessage = await response.text();
      } else {
        await this.getMessageList();
        this.successMessage = await response.text();
      }
      this.$store.action.hideLoading();
    },
    shortenMessage(message) {
      if (message.length > 20) {
        return `${message.substring(0, 20)}...`;
      } else return message;
    },
    toHHMMDDMMYYYY(date) {
      let newDate = new Date(date);
      let hour = newDate.getHours();
      let minute = newDate.getMinutes();
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();

      return `${hour}:${minute} ${day}/${month}/${year - 2000}`;
    },
    statusToText(num) {
      switch (num) {
        case 0:
          return "Đã gửi";
        case 1:
          return "Đã đọc";
        case 2:
          return "Đã phản hồi";
        default:
          break;
      }
    },
  },
  created() {
    this.getMessageList();
  },
};
</script>