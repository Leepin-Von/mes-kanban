<template>
  <div class="outter">
    <div class="modules_container">
      <router-link
        v-for="module in modules"
        :key="module.name"
        :to="`/home/${module.url}`"
        class="modules"
      >
        <svg class="module-icon" aria-hidden="true">
          <use :xlink:href="module.iconName"></use></svg
        >&nbsp;
        <span>{{ module.moduleName }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModulesView",
  data() {
    return {
      modules: [
        {
          iconName: "#icon-kanban",
          moduleName: "MES看板查询",
          url: "kanban",
        },
        {
          iconName: "#icon-jmreport",
          moduleName: "报表设计",
          url: "jmreport",
        },
        {
          iconName: "#icon-jmreport",
          moduleName: "大屏设计",
          url: "drag",
        },
        {
          iconName: "#icon-erp",
          moduleName: "ERP",
          url: "erp",
        }
      ],
    };
  },
  methods: {
    /**
     * 退出登录
     */
    handleAvatarClick() {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("Username");
      this.$router.push("/signIn");
    },
  },
};
</script>

<style lang="scss" scoped>
.outter {
  width: 100vw;
  box-sizing: border-box;

  .modules_container {
    box-sizing: border-box;
    overflow-y: auto;
    height: 87.75%;
    width: 50%;
    margin: 0 auto;
    background-color: #f0f0f0;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
    padding: 8vh 3vw;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;

    .modules {
      box-sizing: border-box;
      height: 4.5rem;
      width: 25%;
      padding: 5px;
      background-color: #fff;
      border: 2px solid #000;
      box-shadow: 3px 3px 0 #000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      color: #000;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      .module-icon {
        height: 100%;
        width: 20%;
        fill: currentColor;
      }

      span {
        font-size: calc(0.75rem + 0.5vw);
        font-weight: bold;
      }
    }

    .pixel-select {
      appearance: none;
      background-color: #fff;
      border: 2px solid #000;
      box-shadow: 3px 3px 0 #000;
      padding: 5px;
      margin-bottom: 10px;
      cursor: pointer;
      font-size: calc(0.75rem + 0.5vw);
      font-weight: bold;
      width: 100%;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #00f;
      }
    }
  }
}
</style>

