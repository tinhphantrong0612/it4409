<template>
  <div :id="id" class="x-dropdown-menu"  style="margin-left: 5px;">
    <button class ='x-btn' @click="isOpen = !isOpen" :class="{ isActive: isOpen }">
      <slot />
    </button>
    <div v-if="isOpen" style="position: absolute; background: white; z-index: 50; right: 0px">
      <dropdown-item 
        v-for="(item, index) in arrays"
        :key="index"
        :item="item"
        :closeDropdown="callToClose"
      >
        {{ item.text }}
      </dropdown-item>
    </div>
  </div>
</template>

<script>
import DropdownItem from './DropdownItem.vue';

export default {
  components: { DropdownItem, },
  name: 'DropdownMenu',
  data() {
    return {
      isOpen: false,
    };
  },
  created() {
    window.addEventListener('click', this.checkClickOn);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.checkClickOn);
  },
  props: {
    arrays: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      required: true,
    },
    dropdownStyle: {
      type: String,
      required: false,
    }
  },
  methods: {
    callToClose() {
      this.isOpen = false;
    },
    checkClickOn(event) {
      if (!document.getElementById(this.id).contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>

