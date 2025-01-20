<template>
  <el-dialog title="componentName" :visible.sync="dialogFormVisible" width="50vw" :before-close="closeDialog"
    :append-to-body="true">
    <div slot="title">
      <svg class="icon-kanban" aria-hidden="true">
        <use xlink:href="#icon-kanban"></use>
      </svg>&nbsp;
      <span>{{ componentId }} - {{ componentName }}</span>
    </div>
    <div class="form-container">
      <el-form :model="form">
        <el-form-item label="课级单位" :label-width="formLabelWidth">
          <el-select v-model="form.superOrg" placeholder="课级单位" clearable @visible-change="orgListVisibleChange">
            <el-option v-for="item in superOrgList" :key="item.ID" :label="item.Name" :value="item.ID">
              <span style="float: left">{{ item.Name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.ID
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.superOrg !== '' && orgList.length > 0" label="组级单位" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.orgArray">
            <el-checkbox border v-for="option in orgList" :label="option.ID" :key="option.ID">{{
              option.Name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="报废含加权" :label-width="formLabelWidth">
          <el-radio-group v-model="form.weighted">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="起讫时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" :picker-options="pickerOptions" format="yyyy年MM月dd日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品类别" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.partClassArray">
            <el-checkbox border v-for="option in prodClassOptions" :label="option" :key="option">{{ option
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button id="start-calculating" type="primary" @click="startCalculation">
            <svg class="icon-calculator" aria-hidden="true">
              <use xlink:href="#icon-calculator"></use>
            </svg>
            开始计算
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { post } from "@/http/api";

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
      formLabelWidth: "85px", // 表单标签的宽度
      /**
       * 表单数据，post请求的参数
       */
      form: {
        superOrg: "", // 课级单位
        orgArray: [], // 组级单位数组
        dateRange: [], // 日期范围
        partClassArray: [], // 产品类别数组
        weighted: "0", // 是否加权
      },
      superOrgList: [], // 课级单位列表
      orgList: [], // 组级单位列表
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
    };
  },
  created() {
    setTimeout(() => {
      this.getSuperOrgList();
    }, 500);
    setTimeout(() => {
      this.getProdClass();
    }, 1500);
  },
  methods: {
    /**
     * 开始计算
     */
    startCalculation() {
      this.postFormData();
      this.closeDialog();
    },
    openDialog() {
      this.dialogFormVisible = true;
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.dialogFormVisible = false;
      this.form = {
        superOrg: "",
        orgArray: this.orgList.map(item => item.ID),
        dateRange: [],
        partClassArray: this.prodClassOptions,
        weighted: "0",
      };
    },
    /**
     * 课级单位下拉框显示/隐藏事件
     * @param e 下拉框是否显示
     */
    orgListVisibleChange(e) {
      if (e) {
        // 下拉框显示
        return;
      } else {
        // 下拉框隐藏
        this.getOrgList();
      }
    },
    /**
     * 获取课级单位列表
     */
    getSuperOrgList() {
      const _this = this;
      _this.postData.docType = "PassSuperOrgList";
      post("/forward", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.superOrgList = res.data;
          } else {
            this.$notify.error({
              title: "获取课级单位出错",
              message: res.errMsg,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "获取课级单位出错",
            message: err,
          });
        });
    },
    /**
     * 获取组级单位列表
     */
    getOrgList() {
      const _this = this;
      _this.postData.docType = "PassOrgList";
      _this.postData.parameters = {
        SuperOrgId: _this.form.superOrg,
      };
      post("/forward", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.orgList = res.data;
            this.form.orgArray = this.orgList.map(item => item.ID);
          } else {
            this.$notify.error({
              title: "获取组级单位出错",
              message: res.errMsg,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "获取组级单位出错",
            message: err,
          });
        });
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
      _this.postData.docType = "MRBGroupScrape";
      _this.postData.parameters = {
        SuperOrg: _this.form.superOrg,
        OrgArray: _this.form.orgArray.join(","),
        BeginDate: _this.form.dateRange[0] || '',
        EndDate: _this.form.dateRange[1] || '',
        PartClassArray: _this.form.partClassArray.join(","),
        Weighted: _this.form.weighted,
        IdStr: "",
      };
      post("/forward", _this.postData)
        .then((res) => {
          this.$showLoading().close();
          if (res.state === "OK") {
            this.$message({
              message: "查询成功",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "查询时出错",
              message: res.errMsg,
            });
          }
        })
        .catch((err) => {
          this.$showLoading().close();
          this.$notify.error({
            title: "查询时出错",
            message: err,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
}

#start-calculating {
  width: 100%;
  background-color: #000;
  color: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;

  &:hover {
    background-color: #fff;
    color: #000;
  }

  .icon-calculator {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.2rem;
    vertical-align: middle;
  }
}
</style>
