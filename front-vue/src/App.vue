<template>
  <div id="app">
    <router-view></router-view>
    <div class="x-spinner" id="spinner" v-show="storedState.loading">
      <div class="x-spinner-page-loading"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      storedState: this.$store.state
    }
  }
};
</script>

<style>
@import url("./style/main.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
