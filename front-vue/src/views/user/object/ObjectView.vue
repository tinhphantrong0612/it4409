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
            v-model="searchTerm"
            placeholder="Nhập tên hàng hóa"
            @search="getNewSearchedList()"
          />
          <div
            class="xi xi-search x-input-search-icon xi-size-100"
            @click="getNewSearchedList()"
          ></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getSearchedList()"
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
    <base-paging-bar
      :totalPage="totalPage"
      :totalRecord="objectList.length"
      :pageNumber="pageNumber"
      :pageSize="pageSize"
      @update:page-number="
        pageNumber = $event;
        getSearchedList();
      "
      @update:page-size="
        pageSize = $event;
        getNewSearchedList();
      "
    ></base-paging-bar>
    <object-detail
      :show="objectDetailShow"
      :unitList="unitList"
      :selectedObjectId="selectedObjectId"
      v-show="objectDetailShow"
      @close="
        objectDetailShow = false;
        selectedObjectId = '';
      "
      @save="getSearchedList()"
    ></object-detail>
    <object-add
      v-if="objectAddShow"
      :unitList="unitList"
      @close="objectAddShow = false"
      @save="
        objectAddShow = false;
        getSearchedList();
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
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import BasePagingBar from "../../../components/components/BasePagingBar.vue";

export default {
  name: "ObjectView",
  props: ["storageId"],
  components: {
    ObjectDetail,
    ObjectAdd,
    BaseInformPopup,
    BasePagingBar,
  },
  data() {
    return {
      objectList: [],
      unitList: [],
      searchTerm: "",
      objectDetailShow: false,
      objectAddShow: false,
      selectedObjectId: "",
      pageSize: 10,
      pageNumber: 1,
      totalRecord: 0,
      totalPage: 0,
      errorMessage: "",
      searchInterval: null,
    };
  },
  computed: {
    console() {
      return console;
    },
  },
  watch: {
    searchTerm: function () {
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(() => {
        this.getNewSearchedList();
      }, 1000);
    },
    storageId: function () {
      if (this.storageId) this.getNewSearchedList();
    },
  },
  methods: {
    async getObjectList() {
      this.$store.action.showLoading();
      this.selectedObjectId = "";
      const response = await fetch(`${this.$currentOrigin}/api/object`, {
        credentials: "include",
      });
      const data = await response.json();
      this.objectList = data;
      this.$store.action.hideLoading();
    },
    async getUnitList() {
      const response = await fetch(`${this.$currentOrigin}/api/unit`, {
        credentials: "include",
      });
      const data = await response.json();
      this.unitList = data;
    },
    async getNewSearchedList() {
      this.pageNumber = 1;
      await this.getSearchedList();
    },
    async getSearchedList() {
      this.$store.action.showLoading();
      this.selectedObjectId = "";
      clearInterval(this.searchInterval);
      const response = await fetch(
        `${this.$currentOrigin}/api/object/search?filter=${this.searchTerm}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`,
        {
          credentials: "include",
        }
      );
      if (response.status == 401) {
        this.$router.push('/authorize');
        return;
      }
      const data = await response.json();
      if (data.data.length == 0) {
        this.errorMessage = `Searched for "${this.searchTerm}" : No result found!`;
        this.totalRecord = 0;
        this.totalPage = 1;
        this.data = [];
      } else {
        this.totalRecord = data.totalRecord;
        this.totalPage = data.totalPage;
        this.objectList = data.data;
      }

      this.$store.action.hideLoading();
    },
    async deleteObject() {
      if (!this.selectedObjectId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `${this.$currentOrigin}/api/object/${this.selectedObjectId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getNewSearchedList();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getSearchedList();
    this.getUnitList();
  },
};
</script>