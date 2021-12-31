<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách mặt hàng</div>
      <button
        class="x-btn x-btn-primary"
        id="btnAdd"
        @click="objectAddShow = true"
      >
        Thêm mặt hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
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
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getObjectList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteObject()"
        ></button>
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
          <tr
            v-for="obj in objectList"
            :key="obj.Id"
            :class="{ 'x-selected-row': selectedObjectId == obj.Id }"
            @dblclick="
              objectDetailShow = true;
              selectedObjectId = obj.Id;
            "
            @click="selectedObjectId = obj.Id"
          >
            <td>{{ obj.DisplayName }}</td>
            <td>{{ obj.UnitName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <object-detail
      :show="objectDetailShow"
      :unitList="unitList"
      :selectedObjectId="selectedObjectId"
      v-show="objectDetailShow"
      @close="
        objectDetailShow = false;
        selectedObjectId = '';
      "
      @save="getObjectList()"
    ></object-detail>
    <object-add
      v-if="objectAddShow"
      :unitList="unitList"
      @close="objectAddShow = false"
      @save="
        objectAddShow = false;
        getObjectList();
      "
    ></object-add>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import ObjectDetail from "./ObjectDetail.vue";
import ObjectAdd from "./ObjectAdd.vue";
import BaseInformPopup from "../../components/components/BaseInformPopup.vue";

export default {
  name: "ObjectView",
  components: {
    ObjectDetail,
    ObjectAdd,
    BaseInformPopup
  },
  data() {
    return {
      objectList: [],
      unitList: [],
      objectDetailShow: false,
      objectAddShow: false,
      selectedObjectId: "",
      errorMessage: ''
    };
  },
  computed: {
    console() {
      return console;
    },
  },
  methods: {
    async getObjectList() {
      this.$store.action.showLoading();
      this.selectedObjectId = "";
      const response = await fetch(`http://localhost:3000/api/object`);
      const data = await response.json();
      this.objectList = data;
      this.$store.action.hideLoading();
    },
    async getUnitList() {
      const response = await fetch(`http://localhost:3000/api/unit`);
      const data = await response.json();
      this.unitList = data;
    },
    async deleteObject() {
      if (!this.selectedObjectId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/object/${this.selectedObjectId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getObjectList();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getObjectList();
    this.getUnitList();
  },
};
</script>