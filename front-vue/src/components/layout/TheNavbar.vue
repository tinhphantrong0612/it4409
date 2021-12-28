<template>
    <div class="x-navbar">
        <router-link class="x-navbar-item" to="/object">Mặt hàng</router-link>
        <router-link class="x-navbar-item" to="/unit">Đơn vị</router-link>
        <div class="x-navbar-item">Khách hàng</div>
        <div class="x-navbar-item">Nhà Cung cấp</div>
        <div class="x-navbar-item">Nhập hàng</div>
        <div class="x-navbar-item">Xuất hàng</div>
    </div>
</template>

<script>
export default {
    name: "TheNavbar"
}
</script>