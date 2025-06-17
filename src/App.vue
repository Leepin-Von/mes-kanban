<template>
  <div id="app" :data-version="ver">
    <router-view />
    <div v-show="isFooterShow" class="footer">当前版本：{{ curVer }}</div>
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
      新增：签核中心Beta版
      修复：顶部导航栏无法显示的问题
      `,
    };
  },
  computed: {
    isFooterShow() {
      return !this.$route.path.startsWith("/home/jmreport")
        || !this.$route.path.startsWith("/home/drag")
        || !this.$route.path === "/home/vform_designer";
    },
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
    background-color: #fff;
    padding-top: 3px;
    padding-bottom: 3px;
    font-family: "Courier New", Courier, monospace;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    color: #666;
    user-select: none;
    font-size: calc(0.5rem + 0.5vw);
    z-index: 100;
  }
}

body {
  margin: 0;
}

.updateMsg {
  white-space: pre-wrap;
}
</style>
