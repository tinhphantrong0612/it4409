<template>
  <div class="x-dropdown-item" @click="doFunc()">
    <slot />
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
