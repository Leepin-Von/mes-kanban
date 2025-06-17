<template>
  <component :is="currentPage" v-if="currentPage" />
  <div v-else class="error-page">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/home" class="back-link">返回首页</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: null,
    };
  },
  created() {
    const pageName = this.$route.params.pageName;
    try {
      // 动态导入组件
      const component = require(`@/components/bi/${this.toPascalCase(
        pageName
      )}.vue`).default;
      this.currentPage = component;
    } catch (e) {
      this.$notify.error({
        title: "错误",
        message: `未找到组件：${pageName}`,
      });
      this.currentPage = null;
    }
  },
  methods: {
    toPascalCase(str) {
      return str.replace(/(^\w|-\w)/g, (match) =>
        match.replace("-", "").toUpperCase()
      );
    },
  },
};
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8;
  color: #333;
}

.error-page h1 {
  font-size: 10rem;
  font-weight: bold;
  margin: 0;
}

.error-page p {
  font-size: 2rem;
  margin-top: 1rem;
}

.back-link {
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.back-link:hover {
  background-color: #0056b3;
}
</style>
