<template>
  <div id="approval_center_container">
    <h1>签核中心</h1>
    <br />
    <h2 v-if="permitEmp">当前签核人: {{ permitEmp }}</h2>
    <h2 v-else>没有签核人信息</h2>
  </div>
</template>

<script>
import { get } from "@/http/api.js";

export default {
  data() {
    return {
      permitEmp: {},
    };
  },
  created() {
    const paperNo = this.$route.params.paperNo;
    if (paperNo) {
      this.getPermitEmp(paperNo);
    } else {
      this.$notify.error({
        title: "错误",
        message: "没有提供单据号",
      });
    }
  },
  methods: {
    getPermitEmp(paperNo) {
      get(`/approval/${paperNo}`)
        .then((res) => {
          if (res.code === 200) {
            this.permitEmp = res.data;
          } else {
            this.$notify.error({
              title: "获取数据失败",
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "获取数据失败",
            message: err.message,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#approval_center_container {
  h1 {
    text-align: center;
  }
}
</style>