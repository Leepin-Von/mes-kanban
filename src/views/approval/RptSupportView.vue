<template>
  <div class="rpt-support-container">
    <approval-center-top
      :is-confirm.sync="approvalStatus"
      :has-permission="canAccess"
      :paper-no="paperNo"
    />
    <p>如隔日單據未結案，相應責任單位主管請自行提懲處單！</p>
    <h1>{{ initialData.fullName }}</h1>
    <h2>工時調撥單</h2>
    <hr />
    <div class="rpt-top">
      <div class="rpt-top__left">
        <pre>單據編號：{{ initialData.paperNo }}</pre>
        <pre>撥出單位：{{ initialData.unit }}</pre>
      </div>
      <div class="rpt-top__right">
        <el-pagination
          background
          small
          layout="sizes, prev, pager, next"
          :total="total"
          :hide-on-single-page="true"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          :current-page="currentPage"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <pre>單據日期：{{ initialData.printDate }}</pre>
        <pre>申 請 人：{{ initialData.whoInPutName }}</pre>
      </div>
    </div>
    <br />
    <div class="rpt-main">
      <transition :name="defaultTransition">
        <div :key="currentPage">
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
            ></el-table-column>
          </el-table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ApprovalCenterTop from "@/components/erp/approval/ApprovalCenterTop.vue";
import { hasPermission } from "@/utils/Permission";
import { post } from "@/http/api";
import { formatNumberToFloatFixed2, formatSpecialDate } from "@/utils/Format";
import moment from "moment";

export default {
  components: {
    ApprovalCenterTop,
  },
  data() {
    return {
      approvalStatus: 0,
      canAccess: true,
      paperNo: this.$route.params.paperNo,
      initialData: {},
      tableData: [],
      pageSize: 5,
      currentPage: 1,
      total: 0,
      defaultTransition: "slide-left",
      tableColumns: [
        { prop: "item", label: "項目", width: 50 },
        { prop: "empId", label: "工號", width: 85 },
        { prop: "empName", label: "姓名", width: 100 },
        { prop: "supportDateB", label: "調撥時間（起）", width: 150 },
        { prop: "supportDateE", label: "調撥時間（迄）", width: 150 },
        { prop: "restHrSum", label: "休息時數", width: 100 },
        { prop: "supportHr", label: "調撥正班時數", width: 110 },
        { prop: "supportExtHr", label: "調撥加班時數", width: 110 },
        { prop: "supportHrSum", label: "調撥總時數", width: 100 },
        { prop: "supportUnitName", label: "接收單位", width: 100 },
        { prop: "note", label: "調撥原因" },
      ],
    };
  },
  async created() {
    const chkAccess = await hasPermission(this.paperNo);
    if (chkAccess) {
      this.getInitialData();
    } else {
      this.canAccess = false;
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getInitialData();
    },
    handleCurrentChange(currentPage) {
      this.defaultTransition =
        currentPage > this.currentPage ? "slide-left" : "slide-right";
      this.currentPage = currentPage;
      this.getInitialData();
    },
    getInitialData() {
      const params = {
        docType: "RptSupport",
        parameters: {
          paperNo: this.paperNo,
        },
        targetType: "RptSupport",
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      post("/approval", params)
        .then((res) => {
          if (res.code === 200) {
            this.total = res.extra.total;
            this.tableData = res.data.map((item) => {
              item.supportDateB = formatSpecialDate(item.supportDateB);
              item.supportDateE = formatSpecialDate(item.supportDateE);
              item.unit = `${item.unitId} ${item.unitName}`;
              item.printDate = moment().format("MM/DD/YYYY");
              item.supportHr = formatNumberToFloatFixed2(item.supportHr);
              item.supportExtHr = formatNumberToFloatFixed2(item.supportExtHr);
              item.restHrSum = formatNumberToFloatFixed2(item.restHrSum);
              item.supportHrSum = formatNumberToFloatFixed2(item.supportHrSum);
              this.initialData = item;
              return {
                item: item.item,
                empId: item.empId,
                empName: item.empName,
                supportDateB: item.supportDateB,
                supportDateE: item.supportDateE,
                restHrSum: item.restHrSum,
                supportHr: item.supportHr,
                supportExtHr: item.supportExtHr,
                supportHrSum: item.supportHrSum,
                supportUnitName: item.supportUnitName,
                note: item.note,
              };
            });
          } else {
            this.$notify.error({
              title: "初始化错误",
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "出错",
            message: err,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.rpt-support-container {
  position: relative;
  padding: 0 80px;
  padding-bottom: 45px;
  background: linear-gradient(#efefef, #ffffff);
  user-select: none;

  p {
    color: #FF461D;
    font-weight: bold;
    font-size: 0.9rem;
  }

  h1 {
    margin-top: 0;
    text-align: center;
    font-family: "宋体";
  }

  h2 {
    text-align: center;
    font-family: "標體楷", "楷体";
    font-weight: normal;
    margin-bottom: 0;
  }

  hr {
    text-align: center;
    width: 7%;
    margin-top: 3px;
    margin-bottom: 0;
    color: #000000;
  }

  .rpt-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 0 50px;
    padding: 0 30px;
  }
  .rpt-main {
    position: relative;
    min-height: 50vh;
    background: inherit;

    > div {
      background: inherit;
    }
  }
}

/* 添加滑动动画效果 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.slide-left-enter {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>