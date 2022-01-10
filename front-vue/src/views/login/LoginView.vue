<template>
  <div>
    <div>
      <input type="text" name="" id="" v-model="username" />
    </div>
    <div>
      <input type="password" name="" id="" v-model="password" />
    </div>
    <button @click="login()">Đăng nhập</button>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      let response = await fetch(`http://localhost:3000/user/login`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
      let data = await response.text();
      if (data == 0) {
        this.$router.push("/admin");
      } else if (data == 1) {
        this.$router.push("/app");
      }
    },
    async checkLogin() {
        let response = await fetch(`http://localhost:3000/user/login`, {
            credentials: 'include'
        })
        if (response.status == 400) return;
        else if (response.status == 200) {
            const data = await response.text();
            if (data == 0) this.$router.push('/admin');
            else if (data == 1) this.$router.push('/app')
        }
    }
  },
};
</script>