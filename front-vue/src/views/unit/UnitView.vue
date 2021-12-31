<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách đơn vị</div>
      <button class="x-btn x-btn-primary" @click="unitAddShow = true">
        Thêm đơn vị
      </button>
    </div>
    <div class="x-toolbar justify-content-end">
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getUnitList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteUnit()"
        ></button>
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
          <tr
            v-for="unit in unitList"
            :key="unit.Id"
            @click="selectedUnitId = unit.Id"
            @dblclick="
              selectedUnitId = unit.Id;
              unitDetailShow = true;
            "
            :class="{ 'x-selected-row': unit.Id == selectedUnitId }"
          >
            <td>{{ unit.Id }}</td>
            <td>{{ unit.DisplayName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <unit-add
      v-if="unitAddShow"
      @close="unitAddShow = false"
      @save="
        unitAddShow = false;
        getUnitList();
      "
    ></unit-add>
    <unit-detail
      v-show="unitDetailShow"
      :show="unitDetailShow"
      :selectedUnitId="selectedUnitId"
      @close="
        unitDetailShow = false;
        selectedUnitId = '';
      "
      @save="
        unitDetailShow = false;
        getUnitList();
      "
    ></unit-detail>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import UnitAdd from "./UnitAdd.vue";
import UnitDetail from "./UnitDetail.vue";
import BaseInformPopup from "../../components/components/BaseInformPopup.vue";

export default {
  name: "UnitView",
  components: {
    UnitAdd,
    UnitDetail,
    BaseInformPopup,
  },
  data() {
    return {
      unitList: [],
      unitAddShow: false,
      unitDetailShow: false,
      selectedUnitId: "",
      errorMessage: "",
    };
  },
  methods: {
    async getUnitList() {
      this.$store.action.showLoading();
      this.selectedUnitId = "";
      const response = await fetch(`http://localhost:3000/api/unit`);
      const data = await response.json();
      this.unitList = data;
      this.$store.action.hideLoading();
    },
    async deleteUnit() {
      if (!this.selectedUnitId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/unit/${this.selectedUnitId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getUnitList();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getUnitList();
  },
};
</script>