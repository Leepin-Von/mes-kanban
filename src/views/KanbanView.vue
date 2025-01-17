<template>
  <div class="home">
    <div class="navbar">
      <svg class="icon-search" aria-hidden="true">
        <use xlink:href="#icon-search"></use>
      </svg>
      <el-tooltip class="item" effect="dark" content="输入 功能代码 或 功能名称 后回车，即可查询" placement="bottom">
        <input type="text" class="input-search" v-model="searchValue" placeholder="输入 功能代码 或 功能名称"
          @keyup.enter="searchComponents">
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
        <div id="avatar" @click="handleAvatarClick">
          <svg class="icon-signOut" aria-hidden="true">
            <use xlink:href="#icon-signOut"></use>
          </svg>
        </div>
      </el-tooltip>
    </div>
    <br />
    <el-row :gutter="24">
      <el-col v-for="component in components" :key="component.componentId" :span="6">
        <div class="pixel-card">
          <CommonComponent :componentId="component.componentId" :componentName="component.componentName"
            @click="handleComponentClick(component.name)">
            <component :ref="component.name" :is="component.name" :componentId="component.componentId"
              :componentName="component.componentName" />
          </CommonComponent>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CommonComponent from '@/components/CommonComponent.vue';
// “小程序”导入
import MRBGroupScrap from '@/components/MRBGroupScrap.vue'

export default {
  name: 'KanbanView',
  components: {
    CommonComponent,
    // “小程序”注册
    MRBGroupScrap,
  },
  data() {
    return {
      searchValue: '',
      components: [
        // “小程序”信息
        {
          name: 'MRBGroupScrap', // 组件名
          componentId: 54001, // 功能代码
          componentName: 'MRB制程群组报废资料查询' // 功能名称
        },
      ],
      filteredComponents: [],
    }
  },
  mounted() {
    this.filteredComponents = this.components; // 初始化时显示所有组件
  },
  methods: {
    /**
     * 退出登录
     */
    handleAvatarClick() {
      this.$router.push('/signIn')
      localStorage.removeItem('Authorization')
      localStorage.removeItem('Username')
    },
    /**
     * 查询功能代码或功能名称
     */
    searchComponents(e) {
      e = e || window.event;
      const value = this.searchValue.trim();
      if (e.keyCode == 13 && value) {
        // searchValue有值且按下了回车
        this.filteredComponents = this.components.filter(component =>
          component.componentId.toString().includes(value) ||
          component.componentName.toLowerCase().includes(value)
        );
        if (this.filteredComponents.length === 0) {
          // 如果过滤结果为空，则显示所有组件
          this.filteredComponents = this.components;
        }
      } else {
        // 否则显示所有组件
        this.filteredComponents = this.components;
      }
    },
    handleComponentClick(componentName) {
      this.$refs[componentName][0].openDialog();
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
  background-color: #f0f0f0;

  .navbar {
    width: 98.25vw;
    background-color: #fff;
    margin: 0 auto;
    padding: 10px;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .icon-search {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 5px;
    }

    .input-search {
      width: 20%;
      height: 24px;
      padding: 4px;
      border: 2px solid #000;
      box-shadow: 2px 2px 0 #000;
      margin-right: 20px;
      outline: none;
      font-size: 1rem;
    }

    #avatar {
      padding: 4px;
      border: 2px solid #000;
      box-shadow: 2px 2px 0 #000;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      .icon-signOut {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .el-row {
    width: 99.5vw;

    .pixel-card {
      background-color: #fff;
      padding: 20px;
      border: 2px solid #000;
      box-shadow: 5px 5px 0 #000;
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
