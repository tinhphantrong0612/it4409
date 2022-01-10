<template>
  <div>
    <div>
      <input type="text" name="" id="" v-model="username" />
    </div>
    <div>
      <input type="password" name="" id="" v-model="password" />
    </div>
    <div>
        <input type="text" name="" id="" v-model="displayName">
    </div>
    <button @click="login()">Đăng nhập</button>
    <button @click="register()">Đăng ký</button>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      username: "",
      password: "",
      displayName: ""
    };
  },
  methods: {
    async login() {
      this.$router.push('/login');
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
    },
    async register() {
      let response = await fetch(`http://localhost:3000/user/register`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          displayName: this.displayName
        }),
      });
      let data = await response.text();
      console.log(data);
    }
  },
};
</script>