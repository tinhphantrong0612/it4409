<template>
  <div id="app">
    <the-header></the-header>
    <the-navbar></the-navbar>
    <the-content></the-content>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue';
import TheNavbar from './components/layout/TheNavbar.vue';
import TheContent from './components/layout/TheContent.vue';
export default {
  name: 'App',
  components: {
    TheHeader,
    TheNavbar,
    TheContent
  }
}
</script>

<style>
@import url('./style/main.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
