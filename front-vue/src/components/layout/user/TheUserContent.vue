<template>
  <router-view :storageId="storageId"></router-view>
</template>

<script>
export default {
  name: "TheUserContent",
  props: ["storageId"]
};
</script>