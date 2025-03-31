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
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="ERP账号" :label-width="formLabelWidth">
          <el-input
            v-model="form.erpAccount"
            @input="form.erpAccount = $event.toUpperCase()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button id="reset-user-pwd" type="primary" @click="resetUserPwd">
            <svg class="icon-yes iconfont" aria-hidden="true">
              <use xlink:href="#icon-yes"></use>
            </svg>
            确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { post } from "@/http/api";
import { decode } from "@/utils/EncryptUtils";

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
    return {
      form: {
        erpAccount: "",
      },
      dialogFormVisible: false, // 控制对话框的显示和隐藏
      formLabelWidth: "85px", // 表单标签的宽度
      labelPosition: "right", // 表单标签的位置
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
      this.form = {
        erpAccount: localStorage.getItem("Username"),
      };
    },
    checkScreenSize() {
      this.labelPosition = window.innerWidth <= 1024 ? "top" : "right";
    },
    /**
     * 确认按钮
     */
    resetUserPwd() {
      this.postFormData();
    },
    openDialog() {
      this.initialFormData();
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.initialFormData();
    },
    copyFallback(text) {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          this.$notify.success({
            message: "复制成功",
            title: "提示",
          });
        } else {
          this.$confirm(`复制失败，请手动复制【${text}】`, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning", 
          })
        }
      } catch (err) {
        this.$notify.error({
          message: "复制失败",
          title: "提示",
        });
      }
      document.body.removeChild(textArea);
    },
    copyNewPwd(newPwd) {
      if (!navigator.clipboard) {
        this.copyFallback(newPwd);
        return;
      }
      navigator.clipboard.writeText(newPwd).then(
        () => {
          this.$notify.success({
            message: "复制成功",
            title: "提示",
          });
        },
        () => {
          this.copyFallback(newPwd);
        }
      );
    },
    postFormData() {
      if (this.form.erpAccount === "") {
        this.$notify.error({
          title: "错误",
          message: "ERP账号不能为空",
        });
        return;
      }
      if (this.form.erpAccount === "ADMIN") {
        this.$notify.error({
          title: "错误",
          message: "无法重置管理员账号的密码",
        });
        return;
      }
      this.$confirm("确定要重置密码吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const _this = this;
          _this.postData.docType = "ResetUserPwd";
          _this.postData.parameters = {
            OPId: localStorage.getItem("Username"),
            UserId: _this.form.erpAccount,
            Code1: "",
            Code2: "",
            API: "1",
          };
          post("/forward", _this.postData)
            .then((res) => {
              if (res.state === "OK") {
                const code1 = res.data[0].Code1;
                const code2 = res.data[0].Code2;
                const newPwd = decode(code1, code2);
                this.$confirm(`重置密码成功，新密码为：${newPwd}`, "提示", {
                  confirmButtonText: "确定并复制",
                  type: "success",
                  showCancelButton: false,
                })
                  .then(() => {
                    this.copyNewPwd(newPwd);
                    this.closeDialog();
                  })
                  .catch((action) => {
                    if (action === "cancel") {
                      this.copyNewPwd(newPwd);
                      this.closeDialog();
                    }
                  });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: `用户【${_this.form.erpAccount}】的密码重置失败，错误信息：${res.errMsg}`,
                });
              }
            })
            .catch((err) => {
              this.$notify.error({
                title: "错误",
                message: `用户【${_this.form.erpAccount}】的密码重置失败，错误信息：${err}`,
              });
            });
        })
        .catch((action) => {
          if (action === "cancel") {
            this.$notify.info({
              title: "取消",
              message: "取消密码重置作业",
            });
            this.closeDialog();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: clamp(300px, 19vw, 21vw) !important;
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
  #reset-user-pwd {
    @include pixel-button;
    width: 80%;
    display: block;
    margin: 0 auto;
    padding: 12px;
    background-color: #000;
    color: #f0f0f0;

    &:hover {
      background-color: #f0f0f0;
      color: #000;
    }
  }

  .icon-resetPwd,
  .icon-yes {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }
}
</style>