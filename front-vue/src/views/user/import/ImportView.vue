<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách hàng nhập</div>
      <button class="x-btn x-btn-primary" @click="importAddShow = true">
        Thêm đơn nhập hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên nhà cung cấp"
            v-model="searchTerm"
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
            <th>Tên nhà cung cấp</th>
            <th>Ngày nhập hàng</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="theImport in theImportList"
            :key="theImport.Id"
            @click="selectedImportId = theImport.Id"
            @dblclick="
              selectedImportId = theImport.Id;
              theImportDetailShow = true;
            "
            :class="{ 'x-selected-row': theImport.Id == selectedImportId }"
          >
            <td>{{ theImport.SupplierName }}</td>
            <td>{{ $utils.toDDMMYYYY(theImport.ImportDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <import-add
      v-if="importAddShow"
      :supplierList="supplierList"
      :objectList="objectList"
      @close="importAddShow = false"
      @save="
        importAddShow = false;
        getNewSearchResult();
      "
    ></import-add>
    <import-detail
      v-show="theImportDetailShow"
      :show="theImportDetailShow"
      :selectedImportId="selectedImportId"
      :supplierList="supplierList"
      @close="
        theImportDetailShow = false;
        selectedImportId = '';
      "
      @save="
        theImportDetailShow = false;
        getNewSearchResult();
      "
      @error="
        selectedImportId = '';
        getNewSearchResult();
        theImportDetailShow = false;
        errorMessage = $event;
      "
    ></import-detail>
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
import ImportAdd from "./ImportAdd.vue";
import ImportDetail from "./ImportDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  components: {
    ImportAdd,
    ImportDetail,
    BaseInformPopup,
    BasePagingBar,
  },
  name: "ImportView",
  data() {
    return {
      theImportList: [],
      supplierList: [],
      objectList: [],
      importAddShow: false,
      theImportDetailShow: false,
      selectedImportId: "",
      errorMessage: "",
      searchTerm: "",
      searchInterval: null,
      pageSize: 10,
      pageNumber: 1,
      totalPage: 1,
      totalRecord: 0,
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
    async getImportList() {
      this.$store.action.showLoading();
      this.selectedImportId = "";
      this.theImportList = await this.$store.action.getListOfThing("import");
      this.$store.action.hideLoading();
    },
    async getSupplierList() {
      this.supplierList = await this.$store.action.getListOfThing("supplier");
    },
    async getObjectList() {
      this.objectList = await this.$store.action.getListOfThing("object");
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
      this.selectedImportId = "";
      const response = await fetch(
        `${this.$currentOrigin}/api/import/search?filter=${this.searchTerm}&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`,
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
      this.theImportList = data.data;
      this.totalPage = data.totalPage;
      this.totalRecord = data.totalRecord;
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getSearchResult();
    this.getSupplierList();
    this.getObjectList();
  },
};
</script>