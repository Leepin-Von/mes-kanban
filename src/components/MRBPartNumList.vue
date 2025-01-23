<template>
  <el-dialog title="componentName" :visible.sync="dialogFormVisible" :before-close="closeDialog" :append-to-body="true">
    <div slot="title">
      <svg class="icon-kanban" aria-hidden="true">
        <use xlink:href="#icon-kanban"></use>
      </svg>&nbsp;
      <span>{{ componentId }} - {{ componentName }}</span>
    </div>
    <div class="form-container">
      <el-form :model="form">
        <el-form-item label="识别码" :label-width="formLabelWidth">
          <el-input v-model="form.idStr" />
        </el-form-item>
        <el-form-item label="订单起讫日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至" start-placeholder="订单开始日期"
            end-placeholder="订单结束日期" :picker-options="pickerOptions" format="yyyy年MM月dd日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发料起讫日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.issueMaterialsDateRange" type="daterange" range-separator="至"
            start-placeholder="发料开始日期" end-placeholder="发料结束日期" :picker-options="pickerOptions" format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品类别" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.partClassArray">
            <el-checkbox border v-for="option in prodClassOptions" :label="option" :key="option">{{ option
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="报废含加权" :label-width="formLabelWidth">
          <el-radio-group v-model="form.weighted">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button id="start-searching" type="primary" @click="startSearching">
            <svg class="icon-search" aria-hidden="true">
              <use xlink:href="#icon-search"></use>
            </svg>
            开始查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { post } from '@/http/api';

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
      dialogFormVisible: false, // 控制对话框的显示和隐藏
      formLabelWidth: "100px", // 表单标签的宽度
      /**
      * 表单数据，post请求的参数
      */
      form: {
        idStr: 'MRB01', // 识别码
        dateRange: [], // 订单日期范围
        issueMaterialsDateRange: [], // 发料日期范围
        partClassArray: [], // 产品类别
        weighted: "0", // 是否加权
      },
      prodClassOptions: [], // 产品类别选项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      /**
      * post请求的数据
      */
      postData: {
        docType: "", // 文档类型
        parameters: {}, // 请求参数
      },
    }
  },
  methods: {
    /**
     * 开始查询
     */
    startSearching() {
      this.postFormData();
      this.closeDialog();
    },
    openDialog() {
      this.getProdClass();
      this.dialogFormVisible = true;
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.dialogFormVisible = false;
      this.form = {
        idStr: 'MRB01',
        dateRange: [],
        issueMaterialsDateRange: [],
        partClassArray: [],
        weighted: "0",
      }
    },
    /**
     * 获取产品类别选项
     */
    getProdClass() {
      const _this = this;
      _this.postData.docType = "ProdClass";
      post("/forward", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.prodClassOptions = res.data;
            this.form.partClassArray = this.prodClassOptions;
          } else {
            this.$notify.error({
              title: "获取产品类别出错",
              message: res.errMsg,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "获取产品类别出错",
            message: err,
          });
        });
    },
    /**
     * 提交表单数据
     */
    postFormData() {
      const _this = this;
      _this.postData.docType = "MRBPartNumList";
      _this.postData.parameters = {
        IdStr: _this.form.idStr,
        BeginDate: _this.form.dateRange[0] || '',
        EndDate: _this.form.dateRange[1] || '',
        IssueBeginDate: _this.form.issueMaterialsDateRange[0] || '',
        IssueEndDate: _this.form.issueMaterialsDateRange[1] || '',
        PartClassArray: _this.form.partClassArray.join(","),
        Weighted: _this.form.weighted,
        API: '1',
      };
      post("/forward", _this.postData)
        .then(res => {
          this.$showLoading().close();
          if (res.state === "OK") {
            this.$message({
              message: "查询成功",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "查询出错",
              message: `【${this.componentId} - ${this.componentName}】：${res.errMsg}`,
            });
          }
        })
        .catch(err => {
          this.$showLoading().close();
          this.$notify.error({
            title: "查询时出错",
            message: `【${this.componentId} - ${this.componentName}】：${err}`,
          });
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  width: clamp(550px, 28vw, 30vw) !important;

  .icon-kanban {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }

  .form-container {
    background-color: #fff;
    padding: 20px;
    border: 2px solid #000;
    box-shadow: 10px 10px 0 #000;
    width: 90%;
    margin: 0 auto;

    .el-form-item__label {
      font-size: 14px;
    }

    .el-checkbox {
      margin-right: 0;
    }

    #start-searching {
      width: 100%;
      background-color: #000;
      color: #fff;
      border: 2px solid #000;
      box-shadow: 4px 4px 0 #000;
      display: block;
      margin: 0 auto;

      &:hover {
        background-color: #fff;
        color: #000;
      }

      .icon-search {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.2rem;
        vertical-align: middle;
      }
    }
  }
}
</style>