<template>
  <div class="mrb-container">
    <div class="pixel-svg-btn" @click="dialogFormVisible = true">
      <svg aria-hidden="true">
        <use xlink:href="#icon-kanban"></use>
      </svg>
      <h2>MRB制程群组报废资料</h2>
    </div>
    <el-dialog title="MRB制程群组报废资料" :visible.sync="dialogFormVisible" width="40%" :before-close="closeDialog">
      <div slot="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kanban"></use>
        </svg>&nbsp;
        <span>MRB制程群组查询</span>
      </div>
      <div class="form-container">
        <el-form :model="form">
          <el-form-item label="课级单位" :label-width="formLabelWidth">
            <el-select v-model="form.SuperOrg" placeholder="课级单位" clearable @visible-change="orgListVisibleChange">
              <el-option v-for="item in superOrgList" :key="item.ID" :label="item.Name" :value="item.ID">
                <span style="float: left">{{ item.Name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.ID
                  }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.SuperOrg !== '' && orgList.length > 0" label="组级单位" :label-width="formLabelWidth">
            <el-checkbox-group v-model="form.OrgArray">
              <el-checkbox border v-for="option in orgList" :label="option.ID" :key="option.ID">{{
                option.Name
                }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="报废含加权" :label-width="formLabelWidth">
            <el-radio-group v-model="form.Weighted">
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
            <el-checkbox-group v-model="form.PartClassArray">
              <el-checkbox border v-for="option in prodClassOptions" :label="option" :key="option">{{ option
                }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button id="start-calculating" type="primary" @click="startCalculation">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-calculator"></use>
              </svg>
              开始计算
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post } from "@/http/api";
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "85px",
      form: {
        SuperOrg: "",
        OrgArray: [],
        dateRange: [],
        PartClassArray: [],
        Weighted: "0",
      },
      superOrgList: [],
      orgList: [],
      prodClassOptions: [],
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
      postData: {
        docType: "",
        parameters: {},
      },
    };
  },
  created() {
    this.getSuperOrgList();
    setTimeout(() => {
      this.getProdClass();
    }, 500);
  },
  methods: {
    startCalculation() {
      this.postFormData();
      this.closeDialog();
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.form = {
        SuperOrg: "",
        OrgArray: this.orgList.map(item => item.ID),
        dateRange: [],
        PartClassArray: this.prodClassOptions,
        Weighted: "0",
      };
    },
    orgListVisibleChange(e) {
      if (e) {
        return;
      } else {
        this.getOrgList();
      }
    },
    getSuperOrgList() {
      const _this = this;
      _this.postData.docType = "PassSuperOrgList";
      post("/transfer", _this.postData)
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
    getOrgList() {
      const _this = this;
      _this.postData.docType = "PassOrgList";
      _this.postData.parameters = {
        SuperOrgId: _this.form.SuperOrg,
      };
      post("/transfer", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.orgList = res.data;
            this.form.OrgArray = this.orgList.map(item => item.ID)
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
    getProdClass() {
      const _this = this;
      _this.postData.docType = "ProdClass";
      post("/transfer", _this.postData)
        .then((res) => {
          if (res.state === "OK") {
            this.prodClassOptions = res.data;
            this.form.PartClassArray = this.prodClassOptions
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
    postFormData() {
      const _this = this;
      _this.postData.docType = "MRBGroupScrape";
      _this.postData.parameters = {
        SuperOrg: _this.form.SuperOrg,
        OrgArray: _this.form.OrgArray.join(","),
        BeginDate: _this.form.dateRange[0],
        EndDate: _this.form.dateRange[1],
        PartClassArray: _this.form.PartClassArray.join(","),
        Weighted: _this.form.Weighted,
        IdStr: "",
      };
      post("/transfer", _this.postData)
        .then((res) => {
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
.mrb-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .pixel-svg-btn {
    cursor: pointer;
    transform: scale(1);
    transition: transform 0.25s;

    svg {
      fill: currentColor;
      overflow: hidden;
    }

    h2 {
      text-align: center;
    }

    &:hover {
      transform: scale(1.1);
      transition: transform 0.25s;
    }
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.35em;
    fill: currentColor;
    overflow: hidden;
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
  }
}
</style>
