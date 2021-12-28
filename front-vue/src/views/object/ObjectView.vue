<template>
    <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách mặt hàng</div>
      <button class="x-btn x-btn-primary" id="btnAdd">Thêm mặt hàng</button>
    </div>
    <div class="x-toolbar">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên hàng hóa"
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
            <th>Tên mặt hàng</th>
            <th>Đơn vị</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr v-for="obj in objectList" :key="obj.Id">
            <td>{{ obj.DisplayName }}</td>
            <td>{{ obj.UnitName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
    name: "ObjectView",
  data() {
    return {
      objectList: [],
      unitList: [],
    };
  },
  computed: {
    console() {
        return console;
    }
  },
  methods: {
    async getObjectList() {
      const response = await fetch(`http://localhost:3000/api/object`);
      const data = await response.json();
      this.objectList = data;
    },
    async getUnitList() {
      const response = await fetch(`http://localhost:3000/api/unit`);
      const data = await response.json();
      this.unitList = data;
    },
  },
  created() {
    this.getObjectList();
    this.getUnitList();
  },
}
</script>