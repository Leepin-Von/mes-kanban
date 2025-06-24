<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import PackageJson from "../package.json";

export default {
  data() {
    return {
      version: PackageJson.version,
    };
  },
  computed: {},
  mounted() {
    console.info(
      "%c Environment %c " + process.env.NODE_ENV + " ",
      "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #FFF; background:#606060; font-weight: bold;",
      "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #FFF; background:#42c02e; font-weight: bold;"
    );
    console.info(
      "%c it-srv-system %c v" + this.version + " ",
      "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #FFD700; background: #606060; font-weight: bold;",
      "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #FFF; background: #5C7BD9; font-weight: bold;"
    );
  },
  methods: {},
};
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
}
</style>
