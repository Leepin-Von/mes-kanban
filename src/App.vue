<template>
  <div id="app" :data-version="ver">
    <router-view />
    <p
      v-show="
        this.$router.currentRoute.path !== '/home/jmreport' &&
        this.$router.currentRoute.path !== '/home/drag'
      "
      class="footer"
    >
      当前版本：{{ curVer }}
    </p>
  </div>
</template>

<script>
import PackageJson from "../package.json";

export default {
  data() {
    return {
      curVer: "",
      ver: PackageJson.version,
      updateMessage: `
      新增：MRB产品类别报废查询
      `,
    };
  },
  mounted() {
    this.checkVersion();
  },
  methods: {
    checkVersion() {
      this.curVer = localStorage.getItem("ver");
      if (this.curVer !== this.ver) {
        this.$alert(this.updateMessage, "新版本发布", {
          confirmButtonText: "刷新",
          callback: (action) => {
            if (action === "confirm") {
              location.reload();
            }
          },
          customClass: "updateMsg",
        });
        localStorage.setItem("ver", this.ver);
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .footer {
    font-family: "Courier New", Courier, monospace;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    color: #666;
    user-select: none;
    font-size: calc(0.5rem + 0.5vw);
  }
}

body {
  margin: 0;
}

.updateMsg {
  white-space: pre-wrap;
}
</style>
