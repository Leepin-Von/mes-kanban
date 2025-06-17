<template>
  <el-dialog
    :class="['pixel-dialog']"
    title="componentName"
    :visible.sync="dialogFormVisible"
    :before-close="closeDialog"
    :append-to-body="true"
  >
    <div slot="title">
      <svg class="icon-kanban" aria-hidden="true">
        <use xlink:href="#icon-kanban"></use></svg
      >&nbsp;
      <span>{{ componentId }} - {{ componentName }}</span>
    </div>
    <div class="form-container">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        :label-position="labelPosition"
      >
        <el-form-item label="部门" :label-width="formLabelWidth" prop="idStr">
          <el-select v-model="form.idStr" placeholder="请选择部门" clearable>
            <template slot="empty">
              <el-skeleton style="width: 100%; margin-top: 8px" animated />
            </template>
            <el-option
              v-for="item in sectorOrgList"
              :key="item.SectorId"
              :label="item.SectorName"
              :value="item.SectorId"
            >
              <span style="float: left">{{ item.SectorName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.SectorId
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起讫日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            id="start-searching"
            type="primary"
            @click="startSearching"
          >
            <svg class="icon-search iconfont" aria-hidden="true">
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
import { post } from "@/http/api";
import apiService from "@/services/api.service";

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
      labelPosition: "right", // 表单标签的位置
      /**
       * 表单数据，post请求的参数
       */
      form: {
        idStr: "all", // 部门
        dateRange: [], // 日期范围
      },
      sectorOrgList: [], // 部门列表
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
      rules: {
        idStr: [{ required: true, message: "请选择部门", trigger: "blur" }],
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
        idStr: "all",
        dateRange: [],
      };
    },
    checkScreenSize() {
      this.labelPosition = window.innerWidth <= 1024 ? "top" : "right";
    },
    /**
     * 开始查询
     */
    startSearching() {
      this.postFormData();
      this.closeDialog();
    },
    openDialog() {
      this.initialFormData();
      this.getSectorOrgList();
      this.dialogFormVisible = true;
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
      this.initialFormData();
    },
    /**
     * 获取部门列表
     */
    async getSectorOrgList() {
      try {
        const res = await apiService.getSectorOrgList();
        if (res.state === "OK") {
          this.sectorOrgList = res.data;
          // 确保 form.idStr 被重新赋值，触发 el-select 更新
          this.$set(this.form, "idStr", "all");
        } else {
          this.$notify.error({
            title: "获取部门出错",
            message: res.errMsg,
          });
        }
      } catch (err) {
        this.$notify.error({
          title: "获取部门出错",
          message: err,
        });
      }
    },
    /**
     * 提交表单数据
     */
    postFormData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const _this = this;
          _this.postData.docType = "LoborCost";
          _this.postData.parameters = {
            IdStr: _this.form.idStr,
            BeginDate: _this.form.dateRange[0] || "",
            EndDate: _this.form.dateRange[1] || "",
            API: "1",
          };
          post("/forward", _this.postData)
            .then((res) => {
              this.$showLoading().close();
              if (res.state === "OK") {
                this.$notify.success({
                  message: "查询成功",
                  title: "提示",
                });
              } else {
                this.$notify.error({
                  title: "查询出错",
                  message: `【${this.componentId} - ${this.componentName}】：${res.errMsg}`,
                });
              }
            })
            .catch((err) => {
              this.$showLoading().close();
              this.$notify.error({
                title: "查询时出错",
                message: `【${this.componentId} - ${this.componentName}】：${err}`,
              });
            });
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查填写是否正确！",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: clamp(380px, 32vw, 35vw) !important;
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

    #start-searching {
      @include pixel-button;
      background: #000;
      color: #f0f0f0;
      width: 100%;
      padding: 12px;

      &:hover {
        background: #f0f0f0 !important;
        color: #000 !important;
      }
    }
  }

  .icon-kanban,
  .icon-search {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
  }
}
</style>