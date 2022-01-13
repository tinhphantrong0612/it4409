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
          @click="getExportList()"
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
            <td>{{ toDDMMYYYY(theExport.ExportDate) }}</td>
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
        getExportList();
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
        getExportList();
      "
      @error="
        selectedExportId = '';
        getExportList();
        theExportDetailShow = false;
        errorMessage = $event;
      "
    ></export-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import ExportAdd from './ExportAdd.vue';
import ExportDetail from "./ExportDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";

export default {
  components: { 
    ExportAdd,
    ExportDetail,
    BaseInformPopup
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
      searchInterval: null
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
    toHHMMDDMMYYYY(date) {
      const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        const hour = theDate.getHours() < 10 ? `0${theDate.getHours()}` : theDate.getHours();
        const minute = theDate.getMinutes() < 10 ? `0${theDate.getMinutes()}` : theDate.getMinutes();
        return `${hour}:${minute} ${day}/${month}/${year}`;
    },
    toDDMMYYYY(date) {
      const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        return `${day}/${month}/${year}`;
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      clearInterval(this.searchInterval);
      this.selectedExportId = "";
      const response = await fetch(`http://localhost:3000/api/export/search?filter=${this.searchTerm}`, {
        credentials: 'include',
      });
      const data = await response.json();
      this.theExportList = data;
      this.$store.action.hideLoading();
    }
  },
  created() {
    this.getExportList();
    this.getCustomerList();
    this.getObjectList();
  },
};
</script>