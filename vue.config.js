const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 代码加密
      config.plugins.push(
        new WebpackObfuscator({
          rotateUnicodeArray: true,
        })
      );
      // 代码混淆
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            mangle: true,
          },
        })
      );
      // 代码压缩
      config.optimization.minimize = true;
    }
  },
  devServer: {
    port: 8527, // 端口号
    proxy: {
      "/api": {
        // 代理的路径前缀（axios 的默认基础 URL），所有以 `/api` 开头的路径都会被代理到目标服务器
        target: "http://127.0.0.1:8528", // 代理的目标服务器地址
        changeOrigin: true, // 是否更改请求的源头（Origin）为代理的目标服务器地址
        pathRewrite: { "^/api": "/api" }, // 路径重写：/api/signIn -> http://localhost:8528/api/signIn
      },
    },
  },
  // CSS 加载器配置
  css: {
    loaderOptions: {
      scss: {
        // 全局注入 mixin 和变量文件
        additionalData: `
          @import "@/assets/styles/pixel.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "资服系统"; // 页面标题
      return args;
    });
  },
});
