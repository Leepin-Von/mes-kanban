<template>
  <div class="seal-apply-container">
    <approval-center-top
      :is-confirm.sync="approvalStatus"
      :has-permission="canAccess"
      :paper-no="paperNo"
    />
    <h1>{{ initialData.fullName }}</h1>
    <h2>印鑑申請單</h2>
    <br />
    <div class="rpt-top">
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
        <pre>編    號：{{ initialData.paperNo }}</pre>
        <pre>申請日期：{{ initialData.paperDate }}</pre>
      </div>
    </div>
    <br />
    <div class="rpt-main">
      <transition :name="defaultTransition">
        <div :key="currentPage">
          <div class="rpt-comment">
            <span class="comment-title">申請單位：</span>
            <span>
              {{ initialData.unitId }}
              {{ initialData.unitName }}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="comment-title">申請人員：</span>
            <span>
              {{ initialData.empId }}
              {{ initialData.empName }}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="comment-title">會簽單位：</span>
            <span>{{ initialData.flowRoute }}</span>
          </div>
          <el-table
            :data="tableData.table1"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table1"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
            ></el-table-column>
          </el-table>
          <el-table
            :data="tableData.table2"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              v-for="(column, index) in tableColumns.table2"
              :key="index"
              :prop="column.prop"
              :label="column.label"
            >
            </el-table-column>
          </el-table>
          <el-table
            :data="tableData.table3"
            border
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
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ApprovalCenterTop from "@/components/erp/approval/ApprovalCenterTop.vue";
import { hasPermission } from "@/utils/Permission";
import { post } from "@/http/api";
import { formatSpecialDate } from "@/utils/Format";

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
      tableData: {
        table1: [
          {
            item: null,
            document: null,
            account: null,
            government: null,
            destineDate: null,
            pattern: null,
            page: null,
            copy: null,
            nothing: "",
          },
        ],
        table2: [
          {
            lkIsLend: null,
            date: null,
            lkComfirmDate: null,
            lkComment: null,
          },
        ],
        table3: [
          {
            note: null,
          },
        ],
      },
      pageSize: 5,
      currentPage: 1,
      total: 0,
      defaultTransition: "slide-left",
      tableColumns: {
        table1: [
          { prop: "item", label: "序號", width: 50 },
          { prop: "document", label: "文件名稱", width: 250 },
          { prop: "account", label: "用途說明", width: 500 },
          { prop: "government", label: "致單位", width: 200 },
          { prop: "destineDate", label: "預定用章時間", width: 200 },
          { prop: "pattern", label: "式", width: 50 },
          { prop: "page", label: "聯", width: 50 },
          { prop: "copy", label: "份數", width: 50 },
          { prop: "nothing", label: "印鑒別" },
        ],
        table2: [
          { prop: "lkIsLend", label: "是否借出" },
          { prop: "date", label: "預計借用時間" },
          { prop: "lkComfirmDate", label: "預計歸還時間" },
          { prop: "lkComment", label: "保管人備註" },
        ],
        table3: [{ prop: "note", label: "整體備註" }],
      },
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
        docType: "SealApply",
        parameters: {
          paperNo: this.paperNo,
        },
        targetType: "SealApply",
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      post("/approval", params)
        .then((res) => {
          if (res.code === 200) {
            this.total = res.extra.total;
            const tableData = res.data.map((item) => {
              item.paperDate = formatSpecialDate(item.paperDate);
              item.document = item.document + "（" + item.lkOrgCopy + "）";
              item.lkIsLend = item.lkIsLend === "x" ? "✘" : "✔";
              item.sDate = item.sDate ?? "";
              item.eDate = item.eDate ?? "";
              if (item.sDate === "" || item.eDate === "") {
                item.date = "";
              } else {
                item.date = `自 ${item.sDate} 至 ${item.eDate}`;
              }
              item.note = item.note.length === 0 ? "暂无数据" : item.note;
              this.initialData = item;
              return {
                table1: [
                  {
                    item: item.item,
                    document: item.document,
                    account: item.account,
                    government: item.government,
                    destineDate: item.destineDate,
                    pattern: item.pattern,
                    page: item.page,
                    copy: item.copy,
                    nothing: "",
                  },
                ],
                table2: [
                  {
                    lkIsLend: item.lkIsLend,
                    date: item.date,
                    lkComfirmDate: item.lkConfirmDate,
                    lkComment: item.lkComment,
                  },
                ],
                table3: [
                  {
                    note: item.note,
                  },
                ],
              };
            });
            this.tableData.table1 = tableData.map(item => item.table1[0]);
            this.tableData.table2 = tableData[0].table2;
            this.tableData.table3 = tableData[0].table3;
            if (this.initialData.lkStastus === "送核") {
              this.approvalStatus = 0;
            }
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
.seal-apply-container {
  position: relative;
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
  .rpt-top {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin: 0 50px;
    padding: 0 30px;
  }
  .rpt-main {
    position: relative;
    min-height: 50vh;
    // background: inherit;

    .rpt-comment {
      padding: 10px;
      background-image: none;

      .comment-title {
        color: #909399;
        font-size: 16px;
        font-weight: bold;
      }
      span {
        color: #606266;
        font-size: 16px;
      }
    }

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