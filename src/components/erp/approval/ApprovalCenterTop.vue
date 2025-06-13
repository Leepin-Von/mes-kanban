<template>
  <div class="approval-center-container">
    <el-form
      ref="approvalStatusForm"
      :model="form"
      :label-width="labelWidth"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <el-form-item label="簽核">
                <div class="radio-group">
                  <el-radio-group
                    v-model="form.isConfirm"
                    v-for="item in approvalStatusOption"
                    :key="item.value"
                  >
                    <el-radio style="margin-right: 20px" :label="item.label">{{
                      item.value
                    }}</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-checkbox v-model="form.isFold">展開單據流程</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工號">
                <el-input v-model="form.confirmEmpId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期">
                <el-date-picker
                  v-model="form.confirmDate"
                  type="date"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item label="備註">
            <el-input
              v-model="form.comment"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-check"
              style="margin-bottom: 8px"
              @click="handleSubmit('approvalStatusForm')"
              >儲存</el-button
            >
            <el-button
              icon="el-icon-close"
              @click="handleCancel('approvalStatusForm')"
              >取消</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { post } from '@/http/api';
export default {
  props: {
    isConfirm: {
      type: Number,
      required: true,
    },
    paperNo: {
      type: String,
      required: true,
    },
  },
  data() {
    let chkStatus = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error("请选择[核可]或[退審]"));
      } else {
        callback();
      }
    };
    let chkComment = (rule, value, callback) => {
      if (value === "" && this.form.isConfirm === 2) {
        callback(new Error("請簡單敘述退審的原因！"));
      } else {
        callback();
      }
    };
    return {
      approvalStatusOption: [
        {
          label: 0,
          value: "未確認",
        },
        {
          label: 1,
          value: "核可",
        },
        {
          label: 2,
          value: "退審",
        },
      ],
      form: {
        isConfirm: 0,
        isFold: false,
        confirmEmpId: localStorage.getItem("Username"),
        confirmDate: "",
        comment: "",
      },
      labelWidth: "120px",
      rules: {
        isConfirm: [{ validator: chkStatus, trigger: "blur" }],
        comment: [
          { max: 50, message: "不能超过50个字符", trigger: "blur" },
          { validator: chkComment, trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    isConfirm: {
      immediate: true,
      handler(newVal) {
        this.form.isConfirm = newVal;
      },
    },
  },
  methods: {
    runFlow() {
      const _this = this;
      const params = {
        paperNo: _this.paperNo,
        topForm: {
          isConfirm: _this.form.isConfirm,
          confirmEmpId: _this.form.confirmEmpId,
          confirmDate: _this.form.confirmDate,
          comment: _this.form.comment,
        },
      }
      post("/approval/runFlow", params).then(res => {
        if (res.code === 200) {
          if (params.topForm.isConfirm === 1) {
            this.$notify.success({
              title: "提示",
              message: "簽核完成"
            });
          } else if (params.topForm.isConfirm === 2) {
            this.$notify.success({
              title: "提示",
              message: "退審完成"
            });
          }
        } else {
          this.$notify.error({
            title: "提示",
            message: res.message
          });
        }
      }).catch(err => {
        this.$notify.error({
          title: "提示",
          message: err
        });
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO 校验通过
          if (this.form.isConfirm === 2) {
            this.$confirm("確定要退審此張單據嗎？", "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                // 处理退审逻辑
                this.runFlow();
              })
              .catch(() => {
                // 用户取消操作
                return;
              });
          } else if (this.form.isConfirm === 1) {
            // TODO 处理核可逻辑
            this.runFlow();
          }
        } else {
          // TODO 校验不通过
          this.$notify.error({
            title: "錯誤",
            message: "請檢查填寫是否正確！",
          })
        }
      });
    },
    handleCancel(formName) {
      this.form.isFold = false;
      this.form.date = "";
      this.form.remark = "";
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.approval-center-container {
  padding: 35px;
  padding-bottom: 0px;

  ::v-deep .el-form-item {
    &__label {
      font-weight: bold;
      color: #9093a5;
      font-size: 16px;
    }
    &__content {
      display: flex;
      flex-direction: column;
      align-items: baseline;
    }
  }

  .radio-group {
    border: 1px solid #cfcfcf;
    padding: 0 10px;
    border-radius: 4px;
  }
}
</style>