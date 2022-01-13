<template>
  <body class = 'x-login-container'>
    <div>
      <label class="x-label x-login-label-title"><b>DTH Solutions</b></label>
      <label class="x-label x-label-title"><b>Username</b></label>
      <div>
        <input class='x-input' style="width:30rem" type="text" name="" id="" v-model="username" />
      </div>
      <label class="x-label x-label-title"><b>Password</b></label>
      <div>
        <input class='x-input' style="width:30rem" type="password" name="" id="" v-model="password" />
      </div>
      <div class="x-login-btn-bar">
        <div>
          <button class ='x-btn x-btn-success x-login-btn-left' @click="login()">Đăng nhập</button>
        </div>
        <div>
          <button class ='x-btn x-btn-success x-login-btn-right' @click="register()">Đăng ký</button>
        </div>
      </div>
    </div>
    <span class="x-label-error" v-show="errorMessage != ''">{{
            errorMessage
      }}</span>
  </body>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
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
      if (response.status == 400) {
        this.errorMessage = await response.text();
        return;
      }
      let user = await response.json();
      if (user['Role'] == 0) {
        this.$router.push("/admin");
      } else if (user['Role'] == 1) {
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
    },
    async register() {
      this.$router.push('/register');
    }
  },
};
</script>