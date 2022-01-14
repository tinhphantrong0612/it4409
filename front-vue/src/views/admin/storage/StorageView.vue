<template>
  <div class="x-content">
    <div class="x-headbar">
      <div class="x-headbar-title">Danh sách kho hàng</div>
      <button
        class="x-btn x-btn-primary"
        id="btnAdd"
        @click="storageAddShow = true"
      >
        Thêm kho hàng
      </button>
    </div>
    <div class="x-toolbar justify-content-between">
      <div class="x-searchgroup">
        <div class="x-input-searchbox">
          <input
            type="search"
            class="x-input x-input-search"
            placeholder="Nhập tên kho hàng"
            v-model="searchTerm"
            @search="getSearchResult()"
          />
          <div class="xi xi-search x-input-search-icon xi-size-100" @click="getSearchResult()"></div>
        </div>
      </div>
      <div class="x-btngroup">
        <button
          class="x-btn x-btn-secondary xi xi-size-x2 xi-reload"
          @click="getStorageList()"
        ></button>
        <button
          class="x-btn x-btn-danger xi xi-size-x2 xi-close"
          @click="deleteStorage()"
        ></button>
      </div>
    </div>
    <div class="x-table-container">
      <table class="x-table">
        <thead>
          <tr>
            <th>Tên kho hàng</th>
            <th>Địa chỉ</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <tr
            v-for="obj in storageList"
            :key="obj.Id"
            :class="{ 'x-selected-row': selectedStorageId == obj.Id }"
            @dblclick="
              storageDetailShow = true;
              selectedStorageId = obj.Id;
            "
            @click="selectedStorageId = obj.Id"
          >
            <td>{{ obj.DisplayName }}</td>
            <td>{{ obj.Address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <storage-detail
      :show="storageDetailShow"
      :selectedStorageId="selectedStorageId"
      v-show="storageDetailShow"
      @close="
        storageDetailShow = false;
        selectedStorageId = '';
      "
      @save="getStorageList()"
    ></storage-detail>
    <storage-add
      v-if="storageAddShow"
      @close="storageAddShow = false"
      @save="
        storageAddShow = false;
        getStorageList();
      "
    ></storage-add>
    <base-inform-popup
      v-show="errorMessage != ''"
      :message="errorMessage"
      @close="errorMessage = ''"
    ></base-inform-popup>
  </div>
</template>

<script>
import BaseInformPopup from "../../../components/components/BaseInformPopup.vue";
import StorageAdd from './StorageAdd.vue';
import StorageDetail from './StorageDetail.vue';

export default {
  name: "StorageView",
  components: {
    BaseInformPopup,
    StorageAdd,
    StorageDetail
  },
  
  data() {
    return {
      storageList: [],
      selectedStorageId: "",
      errorMessage: "",
      storageDetailShow: false,
      storageAddShow: false,
      searchTerm: '',
      searchInterval: null
    };
  },
  watch: {
    searchTerm: function () {
      clearInterval(this.searchInterval);
      this.searchInterval = setTimeout(() => {
        this.getSearchResult();
      }, 1000)
    }
  },
  computed: {
    console() {
      return console;
    },
  },
  methods: {
    async getStorageList() {
      this.$store.action.showLoading();
      this.selectedStorageId = "";
      const response = await fetch(`http://localhost:3000/api/storage`, {
        credentials: "include",
      });
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      }
      const data = await response.json();
      this.storageList = data;
      this.$store.action.hideLoading();
    },
    async deleteStorage() {
      if (!this.selectedStorageId) return;
      this.$store.action.showLoading();
      const response = await fetch(
        `http://localhost:3000/api/storage/${this.selectedStorageId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (response.status == 401) {
        this.$store.action.hideLoading();
        this.$router.push("/authorize");
        return;
      } else if (response.status > 300) {
        this.errorMessage = await response.text();
      } else {
        const data = await response.text();
        console.log(data);
        await this.getStorageList();
      }
      this.$store.action.hideLoading();
    },
    async getSearchResult() {
      this.$store.action.showLoading();
      clearInterval(this.searchInterval);
      this.selectedStorageId = "";
      const response = await fetch(`http://localhost:3000/api/storage/search?filter=${this.searchTerm}`, {
        credentials: 'include',
      });
      const data = await response.json();
      this.storageList = data;
      this.$store.action.hideLoading();
    },
  },
  created() {
    this.getStorageList();
  },
};
</script>