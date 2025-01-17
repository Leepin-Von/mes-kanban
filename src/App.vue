<template>
  <div id="app" :data-version="version">
    <router-view />
    <p class="footer">当前版本：{{ currentVersion }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      version: '',
      currentVersion: '',
      updateMessage: '有新版本发布，请刷新页面以更新到最新版本'
    };
  },
  mounted() {
    this.version = document.querySelector('meta[name="version"]').getAttribute('content');
    this.currentVersion = this.version;
    if (this.currentVersion !== this.version) {
      this.$alert(this.updateMessage, '新版本发布', {
        confirmButtonText: '刷新',
        callback: action => {
          if (action === 'confirm') {
            location.reload();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .footer {
    font-family: 'Courier New', Courier, monospace;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    color: #666;
    user-select: none;
  }
}

body {
  margin: 0;
}
</style>
