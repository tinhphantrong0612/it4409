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
            placeholder="Nhập tên người dùng, tên tài khoản"
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
          @click="getSearchResult()"
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
            <td>{{ $utils.toHHMMDDMMYYYY(msg.SentAt) }}</td>
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
        getSearchResult();
      "
      @save="getNewSearchResult()"
    ></message-details>
    <base-paging-bar
      :totalPage="totalPage"
      :totalRecord="totalRecord"
      :pageNumber="pageNumber"
      :pageSize="pageSize"
      @update:page-number="
        pageNumber = $event;
        getSearchResult();
      "
      @update:page-size="
        pageSize = $event;
        getNewSearchResult();
      "
    ></base-paging-bar>
  </div>
</template>

<script>
import MessageDetails from "./MessageDetails.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  name: "MessageView",
  components: {
    MessageDetails,
    BasePagingBar
  },

  data() {
    return {
      messageList: [],
      selectedMessageId: 0,
      errorMessage: "",
      searchTerm: "",
      searchInterval: null,
      pageSize: 10,
      pageNumber: 1,
      totalPage: 1,
      totalRecord: 0
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
        await this.getNewSearchResult();
      }
      this.$store.action.hideLoading();
    },
    async getNewSearchResult() {
      this.pageNumber = 1;
      await this.getSearchResult();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      clearInterval(this.searchInterval);
      this.selectedMessageId = "";
      const response = await fetch(
        `${this.$currentOrigin}/api/message/search?filter=${this.searchTerm}&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push('/login');
        return;
      }
      const data = await response.json();
      this.messageList = data.data;
      this.totalPage = data.totalPage;
      this.totalRecord = data.totalRecord;
      this.$store.action.hideLoading();
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
    this.getSearchResult();
  },
};
</script>