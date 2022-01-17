<template>
  <div class="x-paging-bar">
    <div class="x-total-record">
      Tổng số kết quả:
      <span>{{ totalRecord }}</span>
    </div>
    <div class="x-paging-control">
      <select
        name=""
        id=""
        class="x-page-size x-input m-0"
        @change="$emit('update:page-size', $event.target.value)"
      >
        <option value="10">10 bản ghi/trang</option>
        <option value="20">20 bản ghi/trang</option>
        <option value="30">30 bản ghi/trang</option>
        <option value="40">40 bản ghi/trang</option>
        <option value="50">50 bản ghi/trang</option>
      </select>
      <div class="x-pagination">
        <div class="x-prev" @click="handlePageSwitch(pageNumber - 1)" :class="{'x-blur': pageNumber == 1}">Trước</div>
        <div class="x-page-numbs">
          <div
            class="x-page-number"
            v-for="(page, index) in pageList"
            :key="index"
            :class="{ 'x-page-selected': page == pageNumber }"
            @click="handlePageSwitch(page)"
          >
            {{ page }}
          </div>
        </div>
        <div class="x-next" @click="handlePageSwitch(pageNumber + 1)" :class="{'x-blur': pageNumber == totalPage}">Sau</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["totalPage", "totalRecord", "pageSize", "pageNumber"],
  computed: {
    pageList() {
      let result = [];
      if (this.totalPage <= 5) {
        for (let i = 1; i <= this.totalPage; i++) {
          result.push(i);
        }
      } else if (this.pageNumber == 1 || this.pageNumber == this.totalPage) {
        result.push(1);
        result.push(2);
        result.push("...");
        result.push(this.totalPage - 1);
        result.push(this.totalPage);
      } else if (this.pageNumber == 2) {
        result.push(1);
        result.push(2);
        result.push(3);
        result.push("...");
        result.push(this.totalPage);
      } else if (this.pageNumber == this.totalPage - 1) {
        result.push(1);
        result.push("...");
        result.push(this.totalPage - 2);
        result.push(this.totalPage - 1);
        result.push(this.totalPage);
      } else {
        result.push(1);
        result.push("...");
        result.push(this.pageNumber);
        result.push("...");
        result.push(this.totalPage);
      }
      return result;
    },
  },
  methods: {
    handlePageSwitch(page) {
      if (
        page == "..." ||
        page == this.pageNumber ||
        page <= 0 ||
        page > this.totalPage
      )
        return;
      else this.$emit("update:page-number", page);
    },
  },
};
</script>