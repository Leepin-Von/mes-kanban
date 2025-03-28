<template>
  <el-dialog
    :class="['pixel-dialog']"
    title="componentName"
    :visible.sync="dialogFormVisible"
    :before-close="closeDialog"
    :append-to-body="true"
  >
    <div slot="title">
      <svg class="icon-resetPwd" aria-hidden="true">
        <use xlink:href="#icon-resetPwd"></use></svg
      >&nbsp;
      <span>{{ componentId }} - {{ componentName }}</span>
    </div>
    <div class="form-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        status-icon
        ref="ruleForm"
        :label-position="labelPosition"
      >
        <el-form-item
          label="原密码"
          prop="originalPwd"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ruleForm.originalPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
          <el-input
            type="password"
            v-model="ruleForm.newPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkNewPwd"
          :label-width="formLabelWidth"
        >
          <el-input
            type="password"
            v-model="ruleForm.checkNewPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="修改原因类别"
          prop="reasonType"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="ruleForm.reasonType"
            placeholder="请选择修改原因类别"
          >
            <el-option
              v-for="item in reasonList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改原因内容" :label-width="formLabelWidth">
          <el-input
            v-model="ruleForm.reason"
            type="textarea"
            placeholder="请输入修改原因内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-container">
            <el-button
              class="btn"
              type="primary"
              @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <el-button class="btn resetBtn" @click="resetForm('ruleForm')"
              >重置</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { post } from "@/http/api";
import { encode } from "@/utils/EncryptUtils";

export default {
  props: {
    componentId: {
      type: Number,
      required: true,
    },
    componentName: {
      type: String,
      required: true,
    },
  },
  data() {
    var validateNewPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkNewPwd !== "") {
          this.$refs.ruleForm.validateField("checkNewPwd");
        }
        callback();
      }
    };
    var validateCheckNewPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        originalPwd: "",
        newPwd: "",
        checkNewPwd: "",
        reasonType: "",
        reason: "",
      },
      dialogFormVisible: false, // 控制对话框的显示和隐藏
      formLabelWidth: "100px", // 表单标签的宽度
      labelPosition: "right", // 表单标签的位置
      reasonList: [
        { value: "A", label: "密码盗用说明" },
        { value: "B", label: "密码泄露说明" },
        { value: "C", label: "密码锁定说明" },
        { value: "D", label: "定期修改说明" },
        { value: "E", label: "维护修改说明" },
      ],
      rules: {
        originalPwd: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
          { validator: validateNewPwd, trigger: "blur" },
        ],
        checkNewPwd: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
          { validator: validateCheckNewPwd, trigger: "blur" },
        ],
      },
      /**
       * post请求的数据
       */
      postData: {
        docType: "", // 文档类型
        parameters: {}, // 请求参数
      },
    };
  },
  mounted() {
    // 监听窗口大小变化
    window.addEventListener("resize", this.checkScreenSize);
    // 初始化检查
    this.checkScreenSize();
  },
  beforeDestroy() {
    // 组件销毁时移除监听器
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    initialFormData() {
      this.ruleForm = {
        originalPwd: "",
        newPwd: "",
        checkNewPwd: "",
        reasonType: "",
        reason: "",
      };
    },
    checkScreenSize() {
      this.labelPosition = window.innerWidth <= 1024 ? "top" : "right";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postFormData();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openDialog() {
      this.initialFormData();
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.initialFormData();
    },
    postFormData() {
      const _this = this;
      const { code1, code2 } = encode(_this.ruleForm.newPwd);
      (_this.postData.docType = "UserChgPwd"),
        (_this.postData.parameters = {
          UserId: localStorage.getItem("Username"),
          PWD: _this.ruleForm.originalPwd,
          Code1: code1,
          Code2: code2,
          ReasonType: _this.ruleForm.reasonType,
          Reason: _this.ruleForm.reason,
          API: "1",
        });
      post("/user_chg_pwd", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.$notify.success({
              message: "密码修改成功",
              title: "提示",
            });
            this.closeDialog();
          } else {
            this.$notify.error({
              message: `密码修改失败，错误原因：${res.errMsg}`,
              title: "提示",
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: `密码修改失败，错误原因：${err}`,
            title: "提示",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: clamp(350px, 28vw, 31vw) !important;
  margin-top: 8vh !important;

  &__body {
    padding: 20px 20px;
  }

  .form-container {
    .el-form-item {
      &__label {
        font-weight: bold;
      }
    }
  }
  .btn-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      @include pixel-button;
      width: 33.33%;
      display: block;
      margin: 0 auto;
      padding: 12px;
      background-color: #000;
      color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #f0f0f0;
        color: #000;
      }
    }
    .resetBtn {
      background-color: lightgray;
      color: #000;
    }
  }

  .icon-resetPwd {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }
}
</style>