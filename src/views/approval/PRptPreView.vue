<template>
  <div class="prptpre-container">
    <approval-center-top :status="approvalStatus" />
    <h1>{{ initialData.FullName }}</h1>
    <h2>請假單</h2>
    <hr />
    <hr />
    <div class="rpt-top">
      <div class="rpt-top__left">
        <pre>請假單編號：&#9;{{ initialData.PreNum }}</pre>
        <pre>請假歸屬日期：&#9;{{ initialData.PreDate }}</pre>
        <pre>列印日期：&#9;{{ initialData.CurrDate }}</pre>
      </div>
      <div class="rpt-top__right">
        <pre>輸入人員：&#9;{{ initialData.WhoInput }}</pre>
        <pre>請假歸屬單位：&#9;{{ initialData.CUnit }}</pre>
      </div>
    </div>
    <br />
    <div class="rpt-main">
      <el-table :data="tableData.table1" border :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="Emp" label="請假員工"></el-table-column>
        <el-table-column prop="Position" label="職稱"></el-table-column>
        <el-table-column prop="PresentName" label="請假別"></el-table-column>
        <el-table-column prop="FromTime" label="預計請假時間（起）"></el-table-column>
        <el-table-column prop="ToTime" label="預計請假時間（迄）"></el-table-column>
        <el-table-column prop="PreHr" label="預計請假時數"></el-table-column>
      </el-table>
      <el-table :data="tableData.table2" border :header-cell-style="{ 'text-align': 'center', 'color': '#008080' }"
        :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="PreReason" label="事由"></el-table-column>
        <el-table-column prop="PreTmp" label="職務代理人"></el-table-column>
      </el-table>
      <el-table :data="tableData.table3" border :cell-class-name="cellClass"
        :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="text" label="本年度已請假別"></el-table-column>
        <el-table-column prop="ActiveDate" label="特休可休日期"></el-table-column>
        <el-table-column prop="CanFree" label="特休可休天數"></el-table-column>
        <el-table-column prop="P5" label="特休已休天數"></el-table-column>
        <el-table-column prop="P1" label="已休事假時數"></el-table-column>
        <el-table-column prop="P2" label="已休病假時數"></el-table-column>
        <el-table-column prop="P10" label="加班互抵時數"></el-table-column>
      </el-table>
      <el-table :data="tableData.table4" border :cell-class-name="cellClass"
        :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="text" label="本年度已請假別"></el-table-column>
        <el-table-column prop="P4" label="已休婚假時數"></el-table-column>
        <el-table-column prop="P9" label="已休喪假時數"></el-table-column>
        <el-table-column prop="P3" label="已休產假時數"></el-table-column>
        <el-table-column prop="P8" label="已休工傷時數"></el-table-column>
        <el-table-column prop="P6" label="已休公假時數"></el-table-column>
        <el-table-column prop="P7" label="已休無薪假時數"></el-table-column>
      </el-table>
      <el-table :data="tableData.table5" border :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="text" label="假別">
          <template slot-scope="scope">
            <span class="cell_pre">{{ scope.row.text }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P1" label="事假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P1_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P2" label="病假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P2_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P3" label="婚假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P3_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P3 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P4" label="喪假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P4_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P4 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P5" label="產假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P5_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P5 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P6" label="工傷假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P6_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P6 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P7" label="公假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P7_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P7 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P8" label="無薪假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P8_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P8 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P9" label="特休假">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P9_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P9 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Bef_P10" label="加班互抵">
          <template slot-scope="scope">
            <span v-if="initialData.Bef_P10_Hr !== 0" class="cell_pre">{{ scope.row.Bef_P10 }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ApprovalCenterTop from "@/components/erp/approval/ApprovalCenterTop.vue";
import { post } from "@/http/api";
import moment from "moment";

export default {
  components: {
    ApprovalCenterTop,
  },
  props: {},
  data() {
    return {
      approvalStatus: 0,
      initialData: {},
      tableData: {
        table1: [],
        table2: [],
        table3: [],
        table4: [],
        table5: [],
      },
      preNum: this.$route.params.preNum,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.$nextTick(() => {
      this.getInitialData();
    });
  },
  mounted() { },
  methods: {
    getInitialData() {
      const params = {
        docType: "PRptPre",
        parameters: {
          PreNum: this.preNum,
        },
      };
      post("/forward", params)
        .then((res) => {
          if (res.state === "OK") {
            this.initialData = res.data[0];
            this.approvalStatus = this.initialData.Status;
            this.initialData.PreDate = moment(new Date(this.initialData.PreDate)).format(
              "MM/DD/YYYY"
            ) || "";
            const fromTime = this.initialData.FromTime;
            const toTime = this.initialData.ToTime;
            const fromTimeLength = fromTime.length;
            const toTimeLength = toTime.length;
            this.initialData.FromTime = moment(new Date(fromTime.substring(0, fromTimeLength - 1))).format("MM/DD/YYYY HH:mm:ss");
            this.initialData.ToTime = moment(new Date(toTime.substring(0, toTimeLength - 1))).format("MM/DD/YYYY HH:mm:ss");
            this.initialData.CurrDate = moment().format("MM/DD/YYYY");
            this.tableData.table1 = [{
              Emp: `${this.initialData.EmpId} ${this.initialData.Name}`,
              Position: this.initialData.Position,
              PresentName: this.initialData.PresentName,
              FromTime: this.initialData.FromTime,
              ToTime: this.initialData.ToTime,
              PreHr: parseFloat(this.initialData.PreHr).toFixed(2),
            }];
            this.tableData.table2 = [{
              PreReason: this.initialData.PreReason,
              PreTmp: this.initialData.PreTmp,
            }];
            this.tableData.table3 = [{
              text: "（不含本假單）",
              ActiveDate: this.initialData.ActiveDate,
              CanFree: parseFloat(this.initialData.CanFree).toFixed(2),
              P5: parseFloat(this.initialData.P5).toFixed(2),
              P1: parseFloat(this.initialData.P1).toFixed(2),
              P2: parseFloat(this.initialData.P2).toFixed(2),
              P10: parseFloat(this.initialData.P10).toFixed(2),
            }];
            this.tableData.table4 = [{
              text: "（不含本假單）",
              P4: parseFloat(this.initialData.P4).toFixed(2),
              P9: parseFloat(this.initialData.P9).toFixed(2),
              P3: parseFloat(this.initialData.P3).toFixed(2),
              P8: parseFloat(this.initialData.P8).toFixed(2),
              P6: parseFloat(this.initialData.P6).toFixed(2),
              P7: parseFloat(this.initialData.P7).toFixed(2),
            }];
            this.tableData.table5 = [{
              text: `最近請假時間及\n近一年請假時數`,
              Bef_P1: `${this.initialData.Bef_P1_Date}\n${parseFloat(this.initialData.Bef_P1_Hr).toFixed(2)}`,
              Bef_P2: `${this.initialData.Bef_P2_Date}\n${parseFloat(this.initialData.Bef_P2_Hr).toFixed(2)}`,
              Bef_P3: `${this.initialData.Bef_P3_Date}\n${parseFloat(this.initialData.Bef_P3_Hr).toFixed(2)}`,
              Bef_P4: `${this.initialData.Bef_P4_Date}\n${parseFloat(this.initialData.Bef_P4_Hr).toFixed(2)}`,
              Bef_P5: `${this.initialData.Bef_P5_Date}\n${parseFloat(this.initialData.Bef_P5_Hr).toFixed(2)}`,
              Bef_P6: `${this.initialData.Bef_P6_Date}\n${parseFloat(this.initialData.Bef_P6_Hr).toFixed(2)}`,
              Bef_P7: `${this.initialData.Bef_P7_Date}\n${parseFloat(this.initialData.Bef_P7_Hr).toFixed(2)}`,
              Bef_P8: `${this.initialData.Bef_P8_Date}\n${parseFloat(this.initialData.Bef_P8_Hr).toFixed(2)}`,
              Bef_P9: `${this.initialData.Bef_P9_Date}\n${parseFloat(this.initialData.Bef_P9_Hr).toFixed(2)}`,
              Bef_P10: `${this.initialData.Bef_P10_Date}\n${parseFloat(this.initialData.Bef_P10_Hr).toFixed(2)}`,
            }];
          } else {
            this.$notify.error({
              title: "初始化错误",
              message: res.errMsg,
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
    cellClass({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return "table_cell_first-row-first-col";
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.prptpre-container {
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
</style>