const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8527,
    proxy: {
      "/api": {
        target: "http://localhost:8528",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "MES看板查询平台";
      return args;
    });
  },
});
