<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách tin nhắn người dùng</div>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên người dùng"
            v-model="searchTerm"
            @search="getSearchResult()"
          />
          <div
            class="xi xi-search x-input-search-icon xi-size-100"
            @click="getSearchResult()"
          ></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getMessageList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteMessage()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Gửi lúc</th>
            <th>Người gửi</th>
            <th>Tên đăng nhập</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="msg in messageList"
            :key="msg.Id"
            :class="{ 'x-selected-row': selectedMessageId == msg.Id }"
            @dblclick="
              messageDetailShow = true;
              selectedMessageId = msg.Id;
            "
            @click="selectedMessageId = msg.Id"
          >
            <td>{{ toHHMMDDMMYYYY(msg.SentAt) }}</td>
            <td>{{ msg.UserDisplayName }}</td>
            <td>{{ msg.Username }}</td>
            <td>{{ shortenMessage(msg.Message) }}</td>
            <td>{{ statusToText(msg.MessageStatus, msg.ResponseStatus) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <message-details
      :selectedMessageId="selectedMessageId"
      v-if="selectedMessageId != 0"
      @close="
        selectedMessageId = 0;
        getMessageList();
      "
      @save="getMessageList()"
    ></message-details>
  </div>
</template>

<script>
import MessageDetails from "./MessageDetails.vue";

export default {
  name: "MessageView",
  components: {
    MessageDetails,
  },

  data() {
    return {
      messageList: [],
      selectedMessageId: 0,
      errorMessage: "",
      searchTerm: "",
      searchInterval: null,
    };
  },
  watch: {
    searchTerm: function () {
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(() => {
        this.getSearchResult();
      }, 1000);
    },
  },
  computed: {
    console() {
      return console;
    },
  },
  methods: {
    async getMessageList() {
      this.$store.action.showLoading();
      this.selectedMessageId = "";
      const response = await fetch(`${this.$currentOrigin}/api/message`, {
        credentials: "include",
      });
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      }
      const data = await response.json();
      this.messageList = data;
      this.$emit("update", {
        event: "reload"
      })
      this.$store.action.hideLoading();
    },
    async deleteMessage() {
      if (!this.selectedMessageId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/message/${this.selectedMessageId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      } else if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getMessageList();
      }
      this.$store.action.hideLoading();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      clearInterval(this.searchInterval);
      this.selectedMessageId = "";
      const response = await fetch(
        `${this.$currentOrigin}/api/message/search?filter=${this.searchTerm}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      this.messageList = data;
      this.$store.action.hideLoading();
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
    statusToText(messageStatus, responseStatus) {
      if (messageStatus == 1 && responseStatus == 0) return "Tin nhắn mới";
      else if (messageStatus == 2 && responseStatus == 0) return "Đã xem";
      else return "Đã phản hồi";
    },
    shortenMessage(message) {
      if (message.length > 30) {
        return `${message.substring(0, 30)}...`;
      } else return message;
    },
  },
  created() {
    this.getMessageList();
  },
};
</script>