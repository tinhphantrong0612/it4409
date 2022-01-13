<template>
  <div class="x-dropdown" @click="show = !show">
    <button class="x-btn">
      {{this.title}}
      <div class="x-func xi xi-dropdown xi-size-125"></div>
    </button>
    <transition name="fade" appear>
      <div v-if="this.show">
        <div
          v-for="(item, i) in this.items"
          :key="i"
          class="x-dropdown-item justify-content-between"
          @click="emit(item.message)">
          {{ item.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    name: "DropDown",
    props: ['title', 'items'],
    data() {
      return {
        show: false,
      }
    },
    methods: {
      emit(message) {
        this.$emit("message", message);
      }
    },
}
</script>