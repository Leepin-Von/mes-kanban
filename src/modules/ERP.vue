<template>
  <div class="erp_container">
    <div class="components-container">
      <div
        class="pixel-card"
        v-for="component in erpFilteredComponents"
        :key="component.componentId"
      >
        <CommonComponent
          :componentId="component.componentId"
          :componentName="component.componentName"
          @click="handleComponentClick(component)"
        >
          <component
            :ref="component.name"
            :is="component.name"
            :componentId="component.componentId"
            :componentName="component.componentName"
          />
        </CommonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import CommonComponent from "@/components/CommonComponent.vue";
// “小程序”导入
import ResetUserPwd from "@/components/erp/ResetUserPwdComponent.vue";
import ChangeUserPwd from "@/components/erp/ChangeUserPwdComponent.vue";
import { mapState } from "vuex";

export default {
  name: "erp-module",
  components: {
    CommonComponent,
    // “小程序”注册
    ResetUserPwd,
    ChangeUserPwd,
  },
  computed: {
    ...mapState("components", ["erpFilteredComponents"]),
  },
  mounted() {
    this.$store.dispatch("components/initErpFilteredComponents");
  },
  methods: {
    /**
     * 打开“小程序”时检查是否有对应权限
     * @param component 每个“小程序”组件
     */
    handleComponentClick(component) {
      this.$refs[component.name][0].openDialog();
    },
  },
};
</script>
<style lang="scss" scoped>
.erp_container {
  .components-container {
    width: 99.5vw;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .pixel-card {
      background-color: #fff;
      padding: 20px;
      border: 2px solid #000;
      box-shadow: 5px 5px 0 #000;
      width: 25vw;
      margin: 0 auto;
    }
  }
}
</style>
