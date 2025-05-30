<template>
  <div class="approval-center-container">
    <el-form ref="approvalStatusForm" :model="form" :label-width="labelWidth">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <el-form-item label="簽核">
                <div class="radio-group">
                  <el-radio-group v-model="form.approvalStatus" v-for="item in approvalStatusOption" :key="item.value">
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
                <el-input v-model="form.empId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期">
                <el-date-picker v-model="form.date" type="date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item label="備註">
            <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-check" style="margin-bottom: 8px"
              @click="handleSubmit">儲存</el-button>
            <el-button icon="el-icon-close" @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      required: true,
    },
  },
  data() {
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
        approvalStatus: 0,
        isFold: false,
        empId: localStorage.getItem("Username"),
        date: "",
        remark: "",
      },
      labelWidth: "120px",
    };
  },
  watch: {
    status: {
      imediate: true,
      handler(newVal) {
        this.form.approvalStatus = newVal;
      }
    },
    // isFold: {
    //   handler(newVal) {
    //     this.form.isFold = newVal;
    //   }
    // },
    // date: {
    //   handler(newVal) {
    //     this.form.date = newVal;
    //   }
    // },
    // remark: {
    //   handler(newVal) {
    //     this.form.remark = newVal;
    //   }
    // }
  },
  methods: {
    handleSubmit() {
      this.$notify.success({
        title: '成功',
        message: '储存成功'
      });
    },
    handleCancel() {
      this.form.isFold = false;
      this.form.date = "";
      this.form.remark = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.approval-center-container {
  padding: 35px;
  padding-bottom: 0px;

  ::v-deep .el-form-item {
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