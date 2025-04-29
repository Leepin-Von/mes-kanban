<template>
  <div class="jimu-report-container">
    <iframe
      :src="iframeSrc"
      frameborder="0"
      width="100%"
      height="100%"
      scrolling="auto"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc:
        "http://10.2.85.19:8528/jmreport/list?token=" +
        localStorage.getItem("Authorization"),
    };
  },
};
</script>

<style lang="scss" scoped>
.jimu-report-container {
  width: 100vw;
  height: 99vh;
  margin: 0 auto;
  position: relative;
}
</style>