<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách đơn vị</div>
      <button class="x-btn x-btn-primary" id="btnAdd">Thêm đơn vị</button>
    </div>
    <div class="x-toolbar">
      <div class="x-btngroup">
        <button class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>ID đơn vị</th>
            <th>Đơn vị</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr v-for="unit in unitList" :key="unit.Id">
              <td>{{ unit.Id }}</td>
            <td>{{ unit.DisplayName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
    name: "UnitView",
    data() {
        return {
            unitList: []
        }
    },
    methods: {
    async getUnitList() {
      const response = await fetch(`http://localhost:3000/api/unit`);
      const data = await response.json();
      this.unitList = data;
    },
  },
  created() {
    this.getUnitList();
  },
}
</script>