<template>
  <div id="approval-center-helper">
    <a :href="'http://10.2.1.253:8527/approval/' + paperNo">{{
      paperNo
    }}</a>
  </div>
</template>

<script>
export default {
  name: "ApprovalCenterView",
  data() {
    return {
      paperNo: "PR2505090010",
    };
  }
};
</script>

<style lang="scss" scoped>
#approval-center-helper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
}
</style>