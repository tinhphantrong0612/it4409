<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách khách hàng</div>
      <button class="x-btn x-btn-primary" @click="customerAddShow = true">
        Thêm khách hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập từ khóa tìm kiếm"
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
          @click="getCustomerList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteCustomer()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Thông tin thêm</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="customer in customerList"
            :key="customer.Id"
            @click="selectedCustomerId = customer.Id"
            @dblclick="
              selectedCustomerId = customer.Id;
              customerDetailShow = true;
            "
            :class="{ 'x-selected-row': customer.Id == selectedCustomerId }"
          >
            <td>{{ customer.DisplayName }}</td>
            <td>{{ customer.Address }}</td>
            <td>{{ customer.Phone }}</td>
            <td>{{ customer.Email }}</td>
            <td>{{ checkNull(customer.MoreInfo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <customer-add
      v-if="customerAddShow"
      @close="customerAddShow = false"
      @save="
        customerAddShow = false;
        getCustomerList();
      "
    ></customer-add>
    <customer-detail
      v-show="customerDetailShow"
      :show="customerDetailShow"
      :selectedCustomerId="selectedCustomerId"
      @close="
        customerDetailShow = false;
        selectedCustomertId = '';
      "
      @save="
        customerDetailShow = false;
        getCustomerList();
      "
    ></customer-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
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
import CustomerAdd from "./CustomerAdd.vue";
import CustomerDetail from "./CustomerDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  components: { CustomerAdd, CustomerDetail, BaseInformPopup, BasePagingBar },
  name: "CustomerView",
  data() {
    return {
      customerList: [],
      customerAddShow: false,
      customerDetailShow: false,
      selectedCustomerId: "",
      errorMessage: "",
      searchTerm: "",
      searchInterval: null,
      totalPage: 1,
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 10,
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
  methods: {
    async getCustomerList() {
      this.$store.action.showLoading();
      this.selectedCustomerId = "";
      const response = await fetch(`${this.$currentOrigin}/api/customer`, {
        credentials: "include",
      });
      const data = await response.json();
      this.customerList = data;
      this.$store.action.hideLoading();
    },
    async deleteCustomer() {
      if (!this.selectedCustomerId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/customer/${this.selectedCustomerId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getCustomerList();
      }
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    },
    async getNewSearchResult() {
      this.pageNumber = 1;
      await this.getSearchResult();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      clearInterval(this.searchInterval);
      this.selectedCustomerId = "";
      const response = await fetch(
        `${this.$currentOrigin}/api/customer/search?filter=${this.searchTerm}&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/login");
        return;
      }
      const data = await response.json();
      this.customerList = data.data;
      this.totalPage = data.totalPage;
      this.totalRecord = data.totalRecord;
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getSearchResult();
  },
};
</script>