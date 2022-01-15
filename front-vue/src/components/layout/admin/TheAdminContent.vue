<template>
  <router-view @update="$emit('update', $event)"></router-view>
</template>

<script>
export default {
  name: "TheAdminContent",
};
</script>