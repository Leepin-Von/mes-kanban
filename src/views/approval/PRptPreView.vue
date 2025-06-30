<template>
  <div class="prptpre-container">
    <approval-center-top
      :is-confirm.sync="approvalStatus"
      :has-permission="canAccess"
      :paper-no="preNum"
    />
    <h1>{{ currentData.initialData.fullName }}</h1>
    <h2>請假單</h2>
    <hr />
    <hr />
    <div class="rpt-top">
      <div class="rpt-top__left">
        <pre>請假單編號：&#9;{{ currentData.initialData.preNum }}</pre>
        <pre>請假歸屬日期：&#9;{{ currentData.initialData.preDate }}</pre>
        <pre>列印日期：&#9;{{ currentData.initialData.currDate }}</pre>
      </div>
      <div class="rpt-top__right">
        <el-pagination
          background
          small
          layout="prev, pager, next"
          :total="total"
          :hide-on-single-page="true"
          :page-size="1"
          :current-page="currentPage"
          :pager-count="5"
          @current-change="handleCurrentChange"
        />
        <pre>輸入人員：&#9;{{ currentData.initialData.whoInput }}</pre>
        <pre>請假歸屬單位：&#9;{{ currentData.initialData.cunit }}</pre>
      </div>
    </div>
    <br />
    <div class="rpt-main">
      <transition :name="defaultTransition">
        <div :key="currentPage">
          <el-table
            :data="currentData.tableData.table1"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table1"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            ></el-table-column>
          </el-table>
          <el-table
            :data="currentData.tableData.table2"
            border
            :header-cell-style="{ 'text-align': 'center', color: '#008080' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table2"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            ></el-table-column>
          </el-table>
          <el-table
            :data="currentData.tableData.table3"
            border
            :cell-class-name="cellClass"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table3"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            ></el-table-column>
          </el-table>
          <el-table
            :data="currentData.tableData.table4"
            border
            :cell-class-name="cellClass"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table4"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            ></el-table-column>
          </el-table>
          <el-table
            :data="currentData.tableData.table5"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table5"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            >
              <template slot-scope="scope">
                <span class="cell_pre">{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ApprovalCenterTop from "@/components/erp/approval/ApprovalCenterTop.vue";

import { post } from "@/http/api";
import { hasPermission } from "@/utils/Permission";
import { formatSpecialDate, formatNumberToFloatFixed2 } from "@/utils/Format";
import moment from "moment";

export default {
  components: {
    ApprovalCenterTop,
  },
  props: {},
  data() {
    return {
      approvalStatus: 0,
      canAccess: true,
      currentPage: 1,
      pages: [],
      currentData: {
        pageNo: 0,
        initialData: {},
        tableData: {},
      },
      total: 0,
      preNum: this.$route.params.preNum,
      tableColumns: {
        table1: [
          { prop: "emp", label: "請假員工" },
          { prop: "position", label: "職稱" },
          { prop: "presentName", label: "請假別" },
          { prop: "fromTime", label: "預計請假時間（起）" },
          { prop: "toTime", label: "預計請假時間（迄）" },
          { prop: "preHr", label: "預計請假時數" },
        ],
        table2: [
          { prop: "preReason", label: "事由" },
          { prop: "preTmp", label: "職務代理人" },
        ],
        table3: [
          { prop: "text", label: "本年度已請假別" },
          { prop: "activeDate", label: "特休可休日期" },
          { prop: "canFree", label: "特休可休天數" },
          { prop: "p5", label: "特休已休天數" },
          { prop: "p1", label: "已休事假時數" },
          { prop: "p2", label: "已休病假時數" },
          { prop: "p10", label: "加班互抵時數" },
        ],
        table4: [
          { prop: "text", label: "本年度已請假別" },
          { prop: "p4", label: "已休婚假時數" },
          { prop: "p9", label: "已休喪假時數" },
          { prop: "p3", label: "已休產假時數" },
          { prop: "p8", label: "已休工傷時數" },
          { prop: "p6", label: "已休公假時數" },
          { prop: "p7", label: "已休無薪假時數" },
        ],
        table5: [
          { prop: "text", label: "假別" },
          { prop: "bef_p1", label: "事假" },
          { prop: "bef_p2", label: "病假" },
          { prop: "bef_p3", label: "婚假" },
          { prop: "bef_p4", label: "喪假" },
          { prop: "bef_p5", label: "產假" },
          { prop: "bef_p6", label: "工傷假" },
          { prop: "bef_p7", label: "公假" },
          { prop: "bef_p8", label: "無薪假" },
          { prop: "bef_p9", label: "特休假" },
          { prop: "bef_p10", label: "加班互抵" },
        ],
      },
      defaultTransition: "slide-left",
    };
  },
  computed: {},
  watch: {},
  async created() {
    const chkAccess = await hasPermission(this.preNum);
    if (chkAccess) {
      this.getInitialData();
    } else {
      this.canAccess = false;
    }
  },
  mounted() {},
  methods: {
    handleCurrentChange(currentPage) {
      this.defaultTransition =
        currentPage > this.currentPage ? "slide-left" : "slide-right";
      this.currentPage = currentPage;
      this.currentData = this.pages[currentPage - 1];
      this.approvalStatus =
        this.currentData.initialData.status === 1
          ? 0
          : this.currentData.initialData.status;
    },
    getInitialData() {
      const params = {
        docType: "PRptPre",
        parameters: {
          PreNum: this.preNum,
        },
        targetType: "PRptPre",
      };
      post("/approval", params)
        .then((res) => {
          if (res.code === 200) {
            this.total = res.extra.total;
            res.data.forEach((item, index) => {
              item.preDate =
                moment(new Date(item.preDate)).format("MM/DD/YYYY") || "";
              item.fromTime = formatSpecialDate(item.fromTime);
              item.toTime = formatSpecialDate(item.toTime);
              item.currDate = moment().format("MM/DD/YYYY");
              const tableData = {
                table1: [
                  {
                    emp: `${item.empId} ${item.name}`,
                    position: item.position,
                    presentName: item.presentName,
                    fromTime: item.fromTime,
                    toTime: item.toTime,
                    preHr: formatNumberToFloatFixed2(item.preHr),
                  },
                ],
                table2: [
                  {
                    preReason: item.preReason,
                    preTmp: item.preTmp,
                  },
                ],
                table3: [
                  {
                    text: "（不含本假單）",
                    activeDate: item.activeDate,
                    canFree: formatNumberToFloatFixed2(item.canFree),
                    p5: formatNumberToFloatFixed2(item.p5),
                    p1: formatNumberToFloatFixed2(item.p1),
                    p2: formatNumberToFloatFixed2(item.p2),
                    p10: formatNumberToFloatFixed2(item.p10),
                  },
                ],
                table4: [
                  {
                    text: "（不含本假單）",
                    p4: formatNumberToFloatFixed2(item.p4),
                    p9: formatNumberToFloatFixed2(item.p9),
                    p3: formatNumberToFloatFixed2(item.p3),
                    p8: formatNumberToFloatFixed2(item.p8),
                    p6: formatNumberToFloatFixed2(item.p6),
                    p7: formatNumberToFloatFixed2(item.p7),
                  },
                ],
                table5: [
                  {
                    text: `最近請假時間及\n近一年請假時數`,
                    bef_p1: `${item.bef_p1_date}\n${this.formatTable5(
                      item.bef_p1_hr
                    )}`,
                    bef_p2: `${item.bef_p2_date}\n${this.formatTable5(
                      item.bef_p2_hr
                    )}`,
                    bef_p3: `${item.bef_p3_date}\n${this.formatTable5(
                      item.bef_p3_hr
                    )}`,
                    bef_p4: `${item.bef_p4_date}\n${this.formatTable5(
                      item.bef_p4_hr
                    )}`,
                    bef_p5: `${item.bef_p5_date}\n${this.formatTable5(
                      item.bef_p5_hr
                    )}`,
                    bef_p6: `${item.bef_p6_date}\n${this.formatTable5(
                      item.bef_p6_hr
                    )}`,
                    bef_p7: `${item.bef_p7_date}\n${this.formatTable5(
                      item.bef_p7_hr
                    )}`,
                    bef_p8: `${item.bef_p8_date}\n${this.formatTable5(
                      item.bef_p8_hr
                    )}`,
                    bef_p9: `${item.bef_p9_date}\n${this.formatTable5(
                      item.bef_p9_hr
                    )}`,
                    bef_p10: `${item.bef_p10_date}\n${this.formatTable5(
                      item.bef_p10_hr
                    )}`,
                  },
                ],
              };
              this.pages.push({
                pageNo: index + 1,
                initialData: item,
                tableData: tableData,
              });
            });
            this.currentData = this.pages[0];
            this.approvalStatus =
              this.currentData.initialData.status === 1
                ? 0
                : this.currentData.initialData.status;
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
    formatTable5(numStr) {
      const num = formatNumberToFloatFixed2(numStr);
      return num === "0.00" ? "" : num;
    },
    cellClass({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return "table_cell_first-row-first-col";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.prptpre-container {
  position: relative;
  // z-index: 1;
  padding: 0 80px;
  padding-bottom: 45px;
  background: linear-gradient(#efefef, #ffffff);
  user-select: none;

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
    width: 8%;
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

    ::v-deep .el-table {
      .table_cell_first-row-first-col {
        color: #000080;
      }

      .cell_pre {
        white-space: pre-line;
      }
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