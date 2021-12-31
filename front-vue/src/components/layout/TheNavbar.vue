<template>
    <div class="x-navbar">
        <router-link class="x-navbar-item" to="/object">Mặt hàng</router-link>
        <router-link class="x-navbar-item" to="/unit">Đơn vị</router-link>
        <router-link class="x-navbar-item" to="/customer">Khách hàng</router-link>
        <router-link class="x-navbar-item" to="/supplier">Nhà cung cấp</router-link>
        <div class="x-navbar-item">Nhập hàng</div>
        <div class="x-navbar-item">Xuất hàng</div>
    </div>
</template>

<script>
export default {
    name: "TheNavbar"
}
</script>