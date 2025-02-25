<template>
  <div class="jimu-bi-container">
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
        "http://10.2.1.253:8528/drag/list?token=" +
        localStorage.getItem("Authorization"),
    };
  },
};
</script>

<style lang="scss" scoped>
.jimu-bi-container {
  width: 100vw;
  height: 99.65vh;
  margin: 0 auto;
  position: relative;
}
</style>