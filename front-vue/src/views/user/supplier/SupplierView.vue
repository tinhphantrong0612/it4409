<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách nhà cung cấp</div>
      <button class="x-btn x-btn-primary" @click="supplierAddShow = true">
        Thêm nhà cung cấp
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-toolbar">
        <div class="x-searchgroup">
          <div class="x-input-searchbox">
            <input
              type="search"
              class="x-input x-input-search"
              v-model="searchTerm"
              placeholder="Nhập từ khóa tìm kiếm"
            />
            <div
              class="xi xi-search x-input-search-icon xi-size-100"
              @click="getSearchResult()"
            ></div>
          </div>
        </div>
        <!-- <dropdown-menu :arrays="dropdownItems">
            Search by : {{this.searchFilter}} <div style = "color: '#fff'" class="xi xi-dropdown" ></div>
        </dropdown-menu> -->
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getSearchResult()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteSupplier()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên nhà cung cấp</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Thông tin thêm</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="supplier in supplierList"
            :key="supplier.Id"
            @click="selectedSupplierId = supplier.Id"
            @dblclick="
              selectedSupplierId = supplier.Id;
              supplierDetailShow = true;
            "
            :class="{ 'x-selected-row': supplier.Id == selectedSupplierId }"
          >
            <td>{{ supplier.DisplayName }}</td>
            <td>{{ supplier.Address }}</td>
            <td>{{ supplier.Phone }}</td>
            <td>{{ supplier.Email }}</td>
            <td>{{ checkNull(supplier.MoreInfo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <supplier-add
      v-if="supplierAddShow"
      @close="supplierAddShow = false"
      @save="
        supplierAddShow = false;
        getSearchResult();
      "
    ></supplier-add>
    <supplier-detail
      v-show="supplierDetailShow"
      :show="supplierDetailShow"
      :selectedSupplierId="selectedSupplierId"
      @close="
        supplierDetailShow = false;
        selectedSuppliertId = '';
      "
      @save="
        supplierDetailShow = false;
        getNewSearchResult();
      "
    ></supplier-detail>
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
import SupplierAdd from "./SupplierAdd.vue";
import SupplierDetail from "./SupplierDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  components: { SupplierAdd, SupplierDetail, BaseInformPopup, BasePagingBar },
  name: "SupplierView",
  data() {
    return {
      supplierList: [],
      supplierAddShow: false,
      supplierDetailShow: false,
      selectedSupplierId: "",
      errorMessage: "",
      searchTerm: "",
      totalPage: 1,
      searchInterval: null,
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 10,
    };
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
    async getSupplierList() {
      this.$store.action.showLoading();
      this.selectedSupplierId = "";
      const response = await fetch(`${this.$currentOrigin}/api/supplier`, {
        credentials: "include",
      });
      const data = await response.json();
      this.supplierList = data;
      this.$store.action.hideLoading();
    },
    async getNewSearchResult() {
      this.pageNumber = 1;
      await this.getSearchResult();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      this.selectedSupplierId = "";
      clearInterval(this.searchInterval);
      const response = await fetch(
        `${this.$currentOrigin}/api/supplier/search?filter=${this.searchTerm}&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`,
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
      this.supplierList = data.data;
      this.totalPage = data.totalPage;
      this.totalRecord = data.totalRecord;
      this.$store.action.hideLoading();
    },
    async deleteSupplier() {
      if (!this.selectedSupplierId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/supplier/${this.selectedSupplierId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getNewSearchResult();
      }
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    },
  },
  created() {
    this.getSearchResult();
  },
};
</script>