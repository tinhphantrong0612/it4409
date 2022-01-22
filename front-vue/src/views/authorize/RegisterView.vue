<template>
  <form ref="registerForm" class="x-login-container">
    <label class="x-label x-login-label-title">LTD Solutions</label>
    <label class="x-label x-login-label-subtitle">Sign Up</label>
    <label class="x-label x-label-title"><b>Your name</b></label>
    <div>
      <input
        class="x-input"
        style="width: 30rem"
        type="text"
        name=""
        v-model="displayName"
      />
    </div>
    <label class="x-label x-label-title"><b>Username</b></label>
    <div>
      <input
        class="x-input"
        style="width: 30rem"
        type="text"
        name=""
        v-model="username"
      />
    </div>
    <label class="x-label x-label-title"><b>Password</b></label>
    <div>
      <input
        class="x-input"
        style="width: 30rem"
        type="password"
        name=""
        v-model="password"
      />
    </div>
    <div class="x-login-btn-bar">
      <div>
        <button class="x-btn x-btn-success x-login-btn-left" @click="login()">
          Quay lại đăng nhập
        </button>
      </div>
      <div>
        <button
          class="x-btn x-btn-success x-login-btn-right"
          @click="
            $event.preventDefault();
            register();
          "
        >
          Đăng ký
        </button>
      </div>
    </div>
    <div v-bind:class="getClass" v-show="message != ''">{{ message }}</div>
  </form>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      username: "",
      password: "",
      displayName: "",
      message: "",
      hasError: false,
    };
  },
  methods: {
    submit: function () {
      this.$refs.form.$el.submit();
    },
    async login() {
      this.$router.push("/authorize");
    },
    async checkLogin() {
      let response = await fetch(`${this.$currentOrigin}/user/login`, {
        credentials: "include",
      });
      if (response.status == 400) return;
      else if (response.status == 200) {
        const data = await response.text();
        if (data == 0) this.$router.push("/admin");
        else if (data == 1) this.$router.push("/app");
      }
    },
    async register() {
      this.$store.action.showLoading();
      let response = await fetch(`${this.$currentOrigin}/user/register`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          displayName: this.displayName,
        }),
      });
      this.$store.action.hideLoading();
      console.log(response.status);
      if (response.status == 201) {
        this.hasError = false;
        setTimeout(() => this.$router.push("/authorize"), 1500);
      } else {
        this.hasError = true;
      }
      this.message = await response.text();
    },
  },
  computed: {
    getClass: function () {
      return this.hasError == false ? "x-label-success" : "x-label-error";
    },
  },
};
</script>