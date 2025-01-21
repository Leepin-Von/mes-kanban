const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // productionSourceMap: false, // 隐藏源码
  devServer: {
    port: 8527, // 端口号
    proxy: {
      "/api": {
        // 代理的路径前缀（axios 的默认基础 URL），所有以 `/api` 开头的路径都会被代理到目标服务器
        target: "http://localhost:8528", // 代理的目标服务器地址
        changeOrigin: true, // 是否更改请求的源头（Origin）为代理的目标服务器地址
        pathRewrite: { "^/api": "/api" }, // 路径重写：/api/signIn -> http://localhost:8528/api/signIn
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "MES看板查询平台"; // 页面标题
      return args;
    });
  },
});
