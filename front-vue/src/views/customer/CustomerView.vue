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
            placeholder="Nhập tên khách hàng"
          />
          <div class="xi xi-search x-input-search-icon xi-size-100"></div>
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
            :class="{'x-selected-row': customer.Id == selectedCustomerId}"
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
        getCustomerList()
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
  </div>
</template>

<script>
import CustomerAdd from './CustomerAdd.vue';
import CustomerDetail from './CustomerDetail.vue';

export default {
  components: { CustomerAdd, CustomerDetail },
  name: "CustomerView",
  data() {
    return {
      customerList: [],
      customerAddShow: false,
      customerDetailShow: false,
      selectedCustomerId: "",
    };
  },
  methods: {
    async getCustomerList() {
      this.$store.action.showLoading();
      this.selectedCustomerId = "";
      const response = await fetch(`http://localhost:3000/api/customer`);
      const data = await response.json();
      this.customerList = data;
      this.$store.action.hideLoading();
    },
    async deleteCustomer() {
      if (!this.selectedCustomerId)
        return;
      this.$store.action.showLoading();
      const response = await fetch(`http://localhost:3000/api/customer/${this.selectedCustomerId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      console.log(data);
      await this.getCustomerList();
      this.$store.action.hideLoading();
    },
    checkNull(data) {
      if (data == "null") return "";
      return data;
    }
  },
  created() {
    this.getCustomerList();
  }
};
</script>