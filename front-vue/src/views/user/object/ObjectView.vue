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
            @search="getNewSearchResult()"
          />
          <div
            class="xi xi-search x-input-search-icon xi-size-100"
            @click="getNewSearchResult()"
          ></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getSearchResult()"
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
      :totalRecord="totalRecord"
      :pageNumber="pageNumber"
      :pageSize="pageSize"
      @update:page-number="
        pageNumber = $event;
        getSearchResult();
      "
      @update:page-size="
        pageSize = $event;
        getNewSearchResult();
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
      @save="getSearchResult()"
    ></object-detail>
    <object-add
      v-if="objectAddShow"
      :unitList="unitList"
      @close="objectAddShow = false"
      @save="
        objectAddShow = false;
        getSearchResult();
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
        this.getNewSearchResult();
      }, 1000);
    },
    storageId: function () {
      if (this.storageId) this.getNewSearchResult();
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
    async getNewSearchResult() {
      this.pageNumber = 1;
      await this.getSearchResult();
    },
    async getSearchResult() {
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
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      }
      const data = await response.json();
      this.totalRecord = data.totalRecord;
      this.totalPage = data.totalPage;
      this.objectList = data.data;

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
        await this.getNewSearchResult();
      }
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getSearchResult();
    this.getUnitList();
  },
};
</script>