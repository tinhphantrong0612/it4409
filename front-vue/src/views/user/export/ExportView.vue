<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách hàng xuất</div>
      <button class="x-btn x-btn-primary" @click="ExportAddShow = true">
        Thêm đơn xuất hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên khách hàng"
            v-model="searchTerm"
            @search="getSearchResult()"
          />
          <div class="xi xi-search x-input-search-icon xi-size-100" @click="getSearchResult()"></div>
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
            <th>Tên khách hàng</th>
            <th>Ngày xuất hàng</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="theExport in theExportList"
            :key="theExport.Id"
            @click="selectedExportId = theExport.Id"
            @dblclick="
              selectedExportId = theExport.Id;
              theExportDetailShow = true;
            "
            :class="{ 'x-selected-row': theExport.Id == selectedExportId }"
          >
            <td>{{ theExport.CustomerName }}</td>
            <td>{{ $utils.toDDMMYYYY(theExport.ExportDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <export-add
      v-if="ExportAddShow"
      :customerList="customerList"
      :objectList="objectList"
      @close="ExportAddShow = false"
      @save="
        ExportAddShow = false;
        getNewSearchResult();
      "
    ></export-add>
    <export-detail
      v-show="theExportDetailShow"
      :show="theExportDetailShow"
      :selectedExportId="selectedExportId"
      :customerList="customerList"
      @close="
        theExportDetailShow = false;
        selectedExportId = '';
      "
      @save="
        theExportDetailShow = false;
        getNewSearchResult();
      "
      @error="
        selectedExportId = '';
        getNewSearchResult();
        theExportDetailShow = false;
        errorMessage = $event;
      "
    ></export-detail>
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
import ExportAdd from './ExportAdd.vue';
import ExportDetail from "./ExportDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  components: { 
    ExportAdd,
    ExportDetail,
    BaseInformPopup,
    BasePagingBar
  },
  name: "ExportView",
  data() {
    return {
      theExportList: [],
      customerList: [],
      objectList: [],
      ExportAddShow: false,
      theExportDetailShow: false,
      selectedExportId: "",
      errorMessage: "",
      searchTerm: "",
      searchInterval: null,
      totalPage: 1,
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 10
    };
  },
  watch: {
    searchTerm: function() {
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(() => {
        this.getSearchResult();
      }, 1000)
    }
  },
  methods: {
    async getExportList() {
      this.$store.action.showLoading();
      this.selectedExportId = "";
      this.theExportList = await this.$store.action.getListOfThing('export');
      this.$store.action.hideLoading();
    },
    async getCustomerList() {
      this.customerList = await this.$store.action.getListOfThing('customer');
    },
    async getObjectList() {
      this.objectList = await this.$store.action.getListOfThing('object');
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
      this.selectedExportId = "";
      const response = await fetch(`${this.$currentOrigin}/api/export/search?filter=${this.searchTerm}&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`, {
        credentials: 'include',
      });
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push('/login');
        return;
      }
      const data = await response.json();
      this.theExportList = data.data;
      this.totalPage = data.totalPage;
      this.totalRecord = data.totalRecord;
      this.$store.action.hideLoading();
    }
  },
  created() {
    this.getObjectList();
    this.getCustomerList();
    this.getNewSearchResult();
  },
};
</script>