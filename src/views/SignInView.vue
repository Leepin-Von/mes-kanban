<template>
  <div class="login-container">
    <h2 style="text-align: center; font-size: calc(1rem + 1vw);">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</h2>
    <el-form :model="loginForm" @submit.native.prevent="handleLogin" @keyup.enter.native="handleLogin">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username" autocomplete="off" @input="loginForm.username = $event.toUpperCase()">
          <template slot="prefix">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-user"></use>
            </svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password" autocomplete="off">
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
        itemId: "",
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
      localStorage.removeItem('Authorization')
      localStorage.removeItem('Username')
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.error("用户名或密码不能为空");
        return;
      }
      // this.loginForm.username = this.loginForm.username.toUpperCase(); // 用户名转大写后再post
      post("/signIn", this.loginForm).then((res) => {
        if (res.code === 200) {
          this.userToken = res.data;
          this.changeLogin({ Authorization: this.userToken });
          localStorage.setItem('Username', this.loginForm.username);
          if (this.$router.currentRoute.path !== "/home") {
            this.$router.push("/home");
          }
        } else {
          this.$notify.error({
            title: "登录失败",
            message: res.message
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: "登录失败",
          message: err
        })
      })
    },
  },
};
</script>

<style lang="scss">
.login-container {
  width: calc(200px + 10vw);
  margin: 15vh auto;
  padding: calc(1rem + 1vw);
  background-color: #f0f0f0;
  border: min(4px, calc(4px + 1vw)) solid #000;
  box-shadow: calc(0.2rem + 0.1vw) calc(0.2rem + 0.1vw) 0 #000;

  .el-form-item {
    margin-bottom: calc(0.8rem + 0.1vw);

    .el-form-item__label {
      font-size: calc(0.75rem + 0.3vw);
      line-height: calc(10px + 2vw);
    }

    .el-form-item__content {
      .el-input__prefix {
        display: flex;
        align-items: center;

        .icon {
          width: calc(1rem + 0.5vw);
          height: calc(1rem + 0.5vh);
          vertical-align: calc(-0.38rem + 0.5vh);
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
  }

  .el-input__inner {
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    height: calc(1.3rem + 2vh);
    font-size: calc(0.8rem + 0.5vw);
  }

  .el-button {
    width: 100%;
    background-color: #000;
    color: #fff;
    border: 2px solid #000;
    box-shadow: 4px 4px 0 #000;
    font-size: calc(0.75rem + 0.3vw);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #fff;
      color: #000;
    }

    .icon {
      width: calc(1rem + 0.5vw);
      height: calc(1rem + 0.5vh);
      vertical-align: middle;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>