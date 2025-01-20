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
      <el-col v-for="component in filteredComponents" :key="component.componentId" :span="6">
        <div class="pixel-card">
          <CommonComponent :componentId="component.componentId" :componentName="component.componentName"
            @click="handleComponentClick(component)">
            <component :ref="component.name" :is="component.name" :componentId="component.componentId"
              :componentName="component.componentName" />
          </CommonComponent>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { post } from '@/http/api';
import CommonComponent from '@/components/CommonComponent.vue';
// “小程序”导入
import MRBGroupScrap from '@/components/MRBGroupScrape.vue'
import MRBPartNumScrap from '@/components/MRBPartNumScrape.vue';

export default {
  name: 'KanbanView',
  components: {
    CommonComponent,
    // “小程序”注册
    MRBGroupScrap,
    MRBPartNumScrap,
  },
  data() {
    return {
      searchValue: '',
      components: [
        // “小程序”信息
        {
          name: 'MRBGroupScrap', // 组件名
          componentId: 54001, // 功能代码
          componentName: 'MRB制程群组报废资料 查询' // 功能名称
        },
        {
          name: 'MRBPartNumScrap', // 组件名
          componentId: 54002, // 功能代码
          componentName: 'MRB料号报废资料 查询' // 功能名称
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
      localStorage.removeItem('Authorization')
      localStorage.removeItem('Username')
      this.$router.push('/signIn')
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
          component.componentName.toLowerCase().includes(value.toLowerCase())
        );
        this.searchValue = '';
        if (this.filteredComponents.length === 0) {
          // 如果过滤结果为空，则显示所有组件
          this.filteredComponents = this.components;
        }
      } else {
        // 否则显示所有组件
        this.filteredComponents = this.components;
        this.searchValue = '';
      }
    },
    /**
     * 打开“小程序”时检查是否有对应权限
     * @param component 每个“小程序”组件
     */
    handleComponentClick(component) {
      const parameters = {
        username: localStorage.getItem('Username'),
        password: '',
        itemId: component.componentId,
      }
      post('/signIn', parameters).then(res => {
        if (res.code === 200) {
          const auth = localStorage.getItem('Authorization');
          if (auth) { this.$refs[component.name][0].openDialog(); } else {
            this.$confirm('检测到当前可能未登录，是否前往登录页面？', '可能未登录', {
              comfirmButtonText: "前往登录",
              cancelButtonText: "我就不"
            }).then(() => {
              localStorage.removeItem('Username');
              localStorage.removeItem('Authorization');
              this.$router.push('/signIn');
            }).catch(() => {
              localStorage.removeItem('Username')
              this.$alert('由不得你，去登录一下吧', '用户疑似抗拒登录', {
                confirmButtonText: '前往登录',
                callback: action => {
                  if (action === 'cancel') {
                    this.$router.push('/signIn');
                  }
                }
              })
            })
          }
        } else {
          this.$notify.error({
            title: '出错',
            message: `打开【${component.componentId} - ${component.componentName}】失败，无此权限`
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '出错',
          message: `打开【${component.componentId} - ${component.componentName}】失败，可能的原因：${err}`
        })
      })

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
