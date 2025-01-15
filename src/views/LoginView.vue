<template>
  <div class="login-container">
    <h2 style="text-align: center;">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</h2>
    <el-form :model="loginForm" @submit.native.prevent="handleLogin" @keyup.enter.native="handleLogin">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username" autocomplete="off">
          <template slot="prefix">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-user"></use>
            </svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" show-password>
          <template slot="prefix">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-lock"></use>
            </svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-signIn"></use>
          </svg>
          登 录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { post } from "@/http/api.js";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      userToken: "",
    };
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    /**
     * 登录
     */
    handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.error("用户名或密码不能为空");
        return;
      }
      post("/signIn", this.loginForm).then((res) => {
        if (res.code === 200) {
          this.userToken = res.data;
          this.changeLogin({ Authorization: this.userToken });
          if (this.$router.currentRoute.path !== "/kanban") {
            this.$router.push("/kanban");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-container {
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f0f0f0;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;

  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.35em;
    fill: currentColor;
    overflow: hidden;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input__inner {
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
  }

  .el-button {
    width: 100%;
    background-color: #000;
    color: #fff;
    border: 2px solid #000;
    box-shadow: 4px 4px 0 #000;

    &:hover {
      background-color: #fff;
      color: #000;
    }
  }

  .el-tabs__item {
    font-size: 14px;

    &:hover {
      color: #989797;
    }
  }

  .el-tabs__item.is-active {
    color: #000000;
    font-weight: bold;
  }

  .el-tabs__active-bar {
    height: 4px;
    background-color: #000;
  }
}
</style>