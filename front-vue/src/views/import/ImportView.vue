<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách hàng nhập</div>
      <button class="x-btn x-btn-primary" @click="importInfoAddShow = true">
        Thêm đơn nhập hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên nhà cung cấp, mặt hàng"
          />
          <div class="xi xi-search x-input-search-icon xi-size-100"></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getImportInfoList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteImportInfo()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên đơn nhập hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Thông tin thêm</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="importInfo in importInfoList"
            :key="importInfo.Id"
            @click="selectedImportInfoId = importInfo.Id"
            @dblclick="
              selectedImportInfoId = importInfo.Id;
              importInfoDetailShow = true;
            "
            :class="{ 'x-selected-row': importInfo.Id == selectedImportInfoId }"
          >
            <td>{{ importInfo.DisplayName }}</td>
            <td>{{ importInfo.Address }}</td>
            <td>{{ importInfo.Phone }}</td>
            <td>{{ importInfo.Email }}</td>
            <td>{{ checkNull(importInfo.MoreInfo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <importInfo-add
      v-if="importInfoAddShow"
      @close="importInfoAddShow = false"
      @save="
        importInfoAddShow = false;
        getImportInfoList();
      "
    ></importInfo-add>
    <importInfo-detail
      v-show="importInfoDetailShow"
      :show="importInfoDetailShow"
      :selectedImportInfoId="selectedImportInfoId"
      @close="
        importInfoDetailShow = false;
        selectedImportInfotId = '';
      "
      @save="
        importInfoDetailShow = false;
        getImportInfoList();
      "
    ></importInfo-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import ImportInfoAdd from "./ImportInfoAdd.vue";
import ImportInfoDetail from "./ImportInfoDetail.vue";
import BaseInformPopup from "../../components/components/BaseInformPopup.vue";

export default {
  components: { ImportInfoAdd, ImportInfoDetail, BaseInformPopup },
  name: "ImportInfoView",
  data() {
    return {
      importInfoList: [],
      importInfoAddShow: false,
      importInfoDetailShow: false,
      selectedImportInfoId: "",
      errorMessage: "",
    };
  },
  methods: {
    async getImportInfoList() {
      this.$store.action.showLoading();
      this.selectedImportInfoId = "";
      const response = await fetch(`http://localhost:3000/api/importInfo`);
      const data = await response.json();
      this.importInfoList = data;
      this.$store.action.hideLoading();
    },
    async deleteImportInfo() {
      if (!this.selectedImportInfoId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/importInfo/${this.selectedImportInfoId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getImportInfoList();
      }
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    },
  },
  created() {
    this.getImportInfoList();
  },
};
</script>