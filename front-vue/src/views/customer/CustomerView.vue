<template>
    <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách khách hàng</div>
      <button class="x-btn x-btn-primary" id="btnAdd">Thêm khách hàng</button>
    </div>
    <div class="x-toolbar">
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
        <button class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Sđt</th>
            <th>Email</th>
            <th>Thông tin thêm</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr v-for="customer in customerList" :key="customer.Id">
            <td>{{ customer.DisplayName }}</td>
            <td>{{ customer.Address }}</td>
            <td>{{ customer.Phone }}</td>
            <td>{{ customer.Email }}</td>
            <td>{{ customer.MoreInfo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
    name: "CustomerView",
  data() {
    return {
      customerList: []
    };
  },
  computed: {
    console() {
        return console;
    }
  },
  methods: {
    async getCustomerList() {
      const response = await fetch(`http://localhost:3000/api/customer`);
      const data = await response.json();
      this.customerList = data;
    },
  },
  created() {
    this.getCustomerList();
  },
}
</script>