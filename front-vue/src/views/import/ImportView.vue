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
          />
          <div class="xi xi-search x-input-search-icon xi-size-100"></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getImportList()"
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
            @click="selectedImportInfoId = theImport.Id"
            @dblclick="
              selectedImportInfoId = theImport.Id;
              theImportDetailShow = true;
            "
            :class="{ 'x-selected-row': theImport.Id == selectedImportInfoId }"
          >
            <td>{{ theImport.SupplierName }}</td>
            <td>{{ toDDMMYYYY(theImport.ImportDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <import-add
      v-if="importAddShow"
      @close="importAddShow = false"
      @save="
        importAddShow = false;
        getImportList();
      "
    ></import-add>
    <!-- <theImport-detail
      v-show="theImportDetailShow"
      :show="theImportDetailShow"
      :selectedImportInfoId="selectedImportInfoId"
      @close="
        theImportDetailShow = false;
        selectedImportInfotId = '';
      "
      @save="
        theImportDetailShow = false;
        getImportList();
      "
    ></theImport-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup> -->
  </div>
</template>

<script>
import ImportAdd from "./ImportAdd.vue";
// theImport ImportDetail from "./ImportInfoDetail.vue";
// theImport BaseInformPopup from "../../components/components/BaseInformPopup.vue";

export default {
  components: { 
    ImportAdd, 
    // ImportInfoDetail, 
    // BaseInformPopup
    },
  name: "ImportView",
  data() {
    return {
      theImportList: [],
      importAddShow: false,
      theImportDetailShow: false,
      selectedImportId: "",
      errorMessage: "",
    };
  },
  methods: {
    async getImportList() {
      this.$store.action.showLoading();
      this.selectedImportId = "";
      const response = await fetch(`http://localhost:3000/api/import`);
      const data = await response.json();
      this.theImportList = data;
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    },
    toDDMMYYYY(date) {
      const theDate = new Date(date);
        const day = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
        const month = theDate.getMonth() < 9 ? `0${theDate.getMonth() + 1}` : theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
  },
  created() {
    this.getImportList();
  },
};
</script>