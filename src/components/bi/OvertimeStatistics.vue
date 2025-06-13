<template>
  <div class="iframe-container">
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
      iframeSrc: "http://10.2.85.19:8528/jimubi/share/view/1079899317192708096?shareToken=TOe0KU9wav3dE5SSZ1OxfGdVzSg1YoZ9",
    };
  },
};
</script>

<style lang="scss" scoped>
.iframe-container {
  width: 100vw;
  height: 99.65vh;
  margin: 0 auto;
  position: relative;
  z-index: 3;
}
</style>