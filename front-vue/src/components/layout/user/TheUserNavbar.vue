<template>
    <div class="x-navbar">
        <router-link class="x-navbar-item" to="/object">Mặt hàng</router-link>
        <router-link class="x-navbar-item" to="/unit">Đơn vị</router-link>
        <router-link class="x-navbar-item" to="/customer">Khách hàng</router-link>
        <router-link class="x-navbar-item" to="/supplier">Nhà cung cấp</router-link>
        <router-link class="x-navbar-item" to="/import">Nhập hàng</router-link>
        <router-link class="x-navbar-item" to="/export">Xuất hàng</router-link>
    </div>
</template>

<script>
export default {
    name: "TheUserNavbar"
}
</script>