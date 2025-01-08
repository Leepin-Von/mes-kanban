<template>
    <div class="login-register-container">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login">
                <el-form :model="loginForm" @submit.native.prevent="handleLogin">
                    <el-form-item label="用户名">
                        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleLogin">登 录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register">
                <el-form :model="registerForm" @submit.native.prevent="handleRegister">
                    <el-form-item label="用户名">
                        <el-input v-model="registerForm.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input type="password" v-model="registerForm.confirmPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleRegister">注 册</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeTab: 'login',
            loginForm: {
                username: '',
                password: ''
            },
            registerForm: {
                username: '',
                password: '',
                confirmPassword: ''
            }
        };
    },
    methods: {
        handleLogin() {
            console.log('登录', this.loginForm);
        },
        handleRegister() {
            console.log('注册', this.registerForm);
        }
    }
};
</script>

<style lang="scss">
.login-register-container {
    width: 400px;
    margin: 100px auto;
    padding: 20px;
    background-color: #f0f0f0;
    border: 4px solid #000;
    box-shadow: 8px 8px 0 #000;

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