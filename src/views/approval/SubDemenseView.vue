<template>
  <div class="sub-demense-container">
    <approval-center-top
      :is-confirm.sync="approvalStatus"
      :has-permission="canAccess"
      :paper-no="paperNo"
    />
    <h2>原物料領料通知單</h2>
    <hr />
    <hr />
    <h4>原物料領料類別：{{ initialData.demenseType }}</h4>
    <div class="rpt-top">
      <div class="rpt-top__left">
        <pre>外包廠商：{{ initialData.scNames }}</pre>
        <pre>領料單位：{{ initialData.deptName }}</pre>
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
        <pre>編    號：{{ initialData.demenseNum }}</pre>
        <pre>領料日期：{{ initialData.demenseDate }}</pre>
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
            >
              <template
                #default="{ row }"
                v-if="column.prop === 'chkQnty' || column.prop === 'notes'"
              >
                  <el-tag
                    v-if="column.prop === 'chkQnty'"
                    :type="row.chkQnty === '是' ? 'success' : 'warning'"
                  >
                    {{ row.chkQnty }}
                  </el-tag>
                  <span v-if="column.prop === 'notes'">{{ row.notes }}</span>
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
import { hasPermission } from "@/utils/Permission";
import { post } from "@/http/api";
import { formatNumberToFloatFixed2 } from "@/utils/Format";

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
        { prop: "demenseItm", label: "項目", width: 50 },
        { prop: "partRevision", label: "料號 / 版序", width: 175 },
        { prop: "matCode", label: "物料編碼", width: 150 },
        { prop: "matSpec", label: "品名 / 規格", width: 350 },
        { prop: "unit", label: "單位", width: 50 },
        { prop: "demenseQnty", label: "請領數量", width: 100 },
        { prop: "dispatchQnty", label: "實發數量", width: 100 },
        { prop: "stockQnty", label: "現有庫存量", width: 100 },
        { prop: "grossArea", label: "發料尺寸", width: 100 },
        { prop: "bigPiece", label: "每張大片數", width: 100 },
        { prop: "chkQnty", label: "足料否", width: 100 },
        { prop: "notes", label: "備註"},
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
        docType: "SubDemense",
        parameters: {
          paperNo: this.paperNo,
        },
        targetType: "SubDemense",
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
      post("/approval", params)
        .then((res) => {
          if (res.code === 200) {
            this.total = res.extra.total;
            this.tableData = res.data.map((item) => {
              item.chkQnty = item.demenseQnty > item.stockQnty ? "否" : "是";
              item.demenseQnty = formatNumberToFloatFixed2(item.demenseQnty.toLocaleString());
              item.dispatchQnty = formatNumberToFloatFixed2(item.dispatchQnty);
              item.stockQnty = formatNumberToFloatFixed2(item.stockQnty);
              item.partRevision = !item.partNum || !item.revision ? "" : `${item.partNum} / ${item.revision}`;
              item.grossArea = item.grossAreaLeng === 0 || item.grossAreaWid === 0 ? "" : `${item.grossAreaLeng} / ${item.grossAreaWid}`;
              item.bigPiece = item.bigPiece === 0 ? "" : item.bigPiece;
              this.initialData = item;
              return {
                demenseItm: item.demenseItm,
                partRevision: item.partRevision,
                matCode: item.matCode,
                matSpec: item.matSpec,
                unit: item.unit,
                demenseQnty: item.demenseQnty,
                dispatchQnty: item.dispatchQnty,
                stockQnty: item.stockQnty,
                grossArea: item.grossArea,
                bigPiece: item.bigPiece,
                chkQnty: item.chkQnty,
                notes: item.notes,
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
.sub-demense-container {
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

  h2,
  h4 {
    text-align: center;
    font-family: "標體楷", "楷体";
    font-weight: normal;
    margin-bottom: 0;
  }

  hr {
    text-align: center;
    width: 20%;
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