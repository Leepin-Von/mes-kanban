const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8527,
    proxy: {
      '/api': {
        target: 'http://localhost:8528',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
