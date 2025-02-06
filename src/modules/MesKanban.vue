<template>
  <div class="kanban_container">
    <div class="components-container">
      <div
        class="pixel-card"
        v-for="component in filteredComponents"
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
import { post } from "@/http/api";
import CommonComponent from "@/components/CommonComponent.vue";
// “小程序”导入
import MRBGroupScrap from "@/components/MRBGroupScrape.vue";
import MRBPartNumScrap from "@/components/MRBPartNumScrape.vue";
import MRBPartNumList from "@/components/MRBPartNumList.vue";
import { mapState } from "vuex";

export default {
  name: "MesKanban",
  components: {
    CommonComponent,
    // “小程序”注册
    MRBGroupScrap,
    MRBPartNumScrap,
    MRBPartNumList,
  },
  computed: {
    ...mapState("components", ["filteredComponents"]),
  },
  mounted() {
    this.$store.dispatch("components/initFilteredComponents");
  },
  methods: {
    /**
     * 打开“小程序”时检查是否有对应权限
     * @param component 每个“小程序”组件
     */
    handleComponentClick(component) {
      const parameters = {
        username: localStorage.getItem("Username"),
        password: "",
        itemId: component.componentId,
      };
      post("/signIn", parameters)
        .then((res) => {
          if (res.code === 200) {
            const auth = localStorage.getItem("Authorization");
            if (auth) {
              this.$refs[component.name][0].openDialog();
            } else {
              this.$confirm(
                "检测到当前可能未登录，是否前往登录页面？",
                "可能未登录",
                {
                  comfirmButtonText: "前往登录",
                  cancelButtonText: "我就不",
                }
              )
                .then(() => {
                  localStorage.removeItem("Username");
                  localStorage.removeItem("Authorization");
                  this.$router.push("/signIn");
                })
                .catch(() => {
                  localStorage.removeItem("Username");
                  this.$alert("由不得你，去登录一下吧", "用户疑似抗拒登录", {
                    confirmButtonText: "前往登录",
                    callback: (action) => {
                      if (action === "cancel") {
                        this.$router.push("/signIn");
                      }
                    },
                  });
                });
            }
          } else {
            this.$notify.error({
              title: "出错",
              message: `打开【${component.componentId} - ${component.componentName}】失败，无此权限`,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "出错",
            message: `打开【${component.componentId} - ${component.componentName}】失败，可能的原因：${err}`,
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.kanban_container {
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
