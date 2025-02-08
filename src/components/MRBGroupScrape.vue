<template>
  <el-dialog :class="['pixel-dialog']" title="componentName" :visible.sync="dialogFormVisible"
    :before-close="closeDialog" :append-to-body="true">
    <div slot="title">
      <svg class="icon-kanban" aria-hidden="true">
        <use xlink:href="#icon-kanban"></use>
      </svg>&nbsp;
      <span>{{ componentId }} - {{ componentName }}</span>
    </div>
    <div class="form-container">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="课级单位" :label-width="formLabelWidth">
          <el-select v-model="form.superOrg" placeholder="课级单位" clearable @visible-change="orgListVisibleChange">
            <template slot="empty">
              <el-skeleton style="width: 100%; margin-top: 8px;" animated />
            </template>
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
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
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
            <svg class="icon-calculator iconfont" aria-hidden="true">
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
import apiService from '@/services/api.service';

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
      labelPosition: 'right', // 表单标签的位置
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
  mounted() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.checkScreenSize);
    // 初始化检查
    this.checkScreenSize();
  },
  beforeDestroy() {
    // 组件销毁时移除监听器
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.labelPosition = window.innerWidth <= 1024 ? 'top' : 'right';
    },
    /**
     * 开始计算
     */
    startCalculation() {
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
        this.getSuperOrgList();
      } else {
        // 下拉框隐藏
        this.getOrgList();
      }
    },
    /**
     * 获取课级单位列表
     */
    async getSuperOrgList() {
      try {
        const res = await apiService.getSuperOrgList();
        if (res.state === "OK") {
          this.superOrgList = res.data;
        } else {
          this.$notify.error({
            title: "获取课级单位出错",
            message: res.errMsg,
          });
        }
      } catch (err) {
        this.$notify.error({
          title: "获取课级单位出错",
          message: err,
        });
      }
    },
    /**
     * 获取组级单位列表
     */
    async getOrgList() {
      if (this.form.superOrg) {
        try {
          const res = await apiService.getOrgList(this.form.superOrg);
          if (res.state === "OK") {
            this.orgList = res.data;
            this.form.orgArray = this.orgList.map(item => item.ID);
          } else {
            this.$notify.error({
              title: "获取组级单位出错",
              message: res.errMsg,
            });
          }
        } catch (err) {
          this.$notify.error({
            title: "获取组级单位出错",
            message: err,
          });
        }
      }
    },
    /**
     * 获取产品类别选项
     */
    async getProdClass() {
      try {
        const res = await apiService.getProdClass();
        if (res.state === "OK") {
          this.prodClassOptions = res.data;
          this.form.partClassArray = this.prodClassOptions;
        } else {
          this.$notify.error({
            title: "获取产品类别出错",
            message: res.errMsg,
          });
        }
      } catch (err) {
        this.$notify.error({
          title: "获取产品类别出错",
          message: err,
        });
      }
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
::v-deep .el-dialog {
  width: clamp(500px, 35vw, 38vw) !important;
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

  #start-calculating {
    @include pixel-button;
    width: 100%;
    padding: 12px;
    background-color: #000;
    color: #f0f0f0;

    &:hover {
      background-color: #f0f0f0;
      color: #000;
    }
  }

  .icon-kanban,
  .icon-calculator {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }
}
</style>
