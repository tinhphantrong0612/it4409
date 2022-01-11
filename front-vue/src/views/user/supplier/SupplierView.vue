<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách nhà cung cấp</div>
      <button class="x-btn x-btn-primary" @click="supplierAddShow = true">
        Thêm nhà cung cấp
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
          @click="getSupplierList()"
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
        getSupplierList();
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
        getSupplierList();
      "
    ></supplier-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import SupplierAdd from "./SupplierAdd.vue";
import SupplierDetail from "./SupplierDetail.vue";
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";

export default {
  components: { SupplierAdd, SupplierDetail, BaseInformPopup },
  name: "SupplierView",
  data() {
    return {
      supplierList: [],
      supplierAddShow: false,
      supplierDetailShow: false,
      selectedSupplierId: "",
      errorMessage: "",
    };
  },
  methods: {
    async getSupplierList() {
      this.$store.action.showLoading();
      this.selectedSupplierId = "";
      const response = await fetch(`http://localhost:3000/api/supplier`, {
        credentials: 'include',
      });
      const data = await response.json();
      this.supplierList = data;
      this.$store.action.hideLoading();
    },
    async deleteSupplier() {
      if (!this.selectedSupplierId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/supplier/${this.selectedSupplierId}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getSupplierList();
      }
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    },
  },
  created() {
    this.getSupplierList();
  },
};
</script>