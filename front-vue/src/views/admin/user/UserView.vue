<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách người dùng</div>
      <button
        class="x-btn x-btn-primary"
        id="btnAdd"
        @click="userAdminAddShow = true"
      >
        Thêm quản trị viên
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            v-model="searchTerm"
            placeholder="Nhập tên người dùng, tên tài khoản"
            @search="getNewSearchResult()"
          />
          <div
            class="xi xi-search x-input-search-icon xi-size-100"
            @click="getNewSearchResult()"
          ></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getSearchResult()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Tên đăng nhập</th>
            <th>Vị trí</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="user in userList"
            :key="user.Id"
            :class="{ 'x-selected-row': selectedUserId == user.Id }"
            @dblclick="
              userDetailShow = true;
              selectedUserId = user.Id;
            "
            @click="selectedUserId = user.Id"
          >
            <td>{{ user.DisplayName }}</td>
            <td>{{ user.Username }}</td>
            <td>{{ $utils.toRoleName(user.Role) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
    <user-detail
      :show="userDetailShow"
      :selectedUserId="selectedUserId"
      v-show="userDetailShow"
      @close="
        userDetailShow = false;
        selectedUserId = '';
      "
      @save="getNewSearchResult()"
    ></user-detail>
    <user-admin-add
      v-show="userAdminAddShow"
      @save="getNewSearchResult()"
      @close="userAdminAddShow = false"
    >
    </user-admin-add>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import UserDetail from "./UserDetail.vue";
import UserAdminAdd from "./UserAdminAdd.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  name: "UserView",
  components: {
    UserDetail,
    UserAdminAdd,
    BaseInformPopup,
    BasePagingBar,
  },
  data() {
    return {
      userList: [],
      unitList: [],
      searchTerm: "",
      userDetailShow: false,
      userAdminAddShow: false,
      selectedUserId: "",
      pageSize: 10,
      pageNumber: 1,
      totalRecord: 0,
      totalPage: 0,
      errorMessage: "",
      searchInterval: null,
    };
  },
  computed: {
    console() {
      return console;
    },
  },
  watch: {
    searchTerm: function () {
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(() => {
        this.getNewSearchResult();
      }, 1000);
    },
  },
  methods: {
    async getUserList() {
      this.$store.action.showLoading();
      this.selectedUserId = "";
      const response = await fetch(`${this.$currentOrigin}/api/user`, {
        credentials: "include",
      });
      const data = await response.json();
      this.userList = data;
      this.$store.action.hideLoading();
    },
    async getNewSearchResult() {
      this.pageNumber = 1;
      await this.getSearchResult();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      this.selectedUserId = "";
      clearInterval(this.searchInterval);
      const response = await fetch(
        `${this.$currentOrigin}/user/search?filter=${this.searchTerm}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      }
      const data = await response.json();
      this.totalRecord = data.totalRecord;
      this.totalPage = data.totalPage;
      this.userList = data.data;
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getSearchResult();
  },
};
</script>