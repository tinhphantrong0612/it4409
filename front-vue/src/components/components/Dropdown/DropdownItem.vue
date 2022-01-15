<template>
  <div class="x-dropdown-item" @click="doFunc()">
    <slot />
    <div class="notify-red" v-show="item.isHighlight"></div>
  </div>
</template>

<script>
export default {
  name: 'DropdownItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    closeDropdown: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    doFunc() {
      this.item.onClick();
      this.closeDropdown();
    }
  }
};
</script>

<style scoped>
.notify-red {
  background-color: red;
  width: 6px;
  height: 6px;
  position: absolute;
  border-radius: 50%;
  top: 8px;
  right: 8px;
}
</style>