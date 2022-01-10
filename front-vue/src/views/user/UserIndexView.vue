<template>
  <div>
    <the-user-header></the-user-header>
    <the-user-navbar></the-user-navbar>
    <the-user-content></the-user-content>
  </div>
</template>

<script>
import TheUserHeader from "../../components/layout/user/TheUserHeader.vue";
import TheUserNavbar from "../../components/layout/user/TheUserNavbar.vue";
import TheUserContent from "../../components/layout/user/TheUserContent.vue";

export default {
  name: "UserIndexView",
  components: {
    TheUserHeader,
    TheUserNavbar,
    TheUserContent,
  },
  data() {
    return {
      storageId: ''
    }
  }
};
</script>