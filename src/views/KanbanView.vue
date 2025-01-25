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
      <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
        <div id="refresh" @click="refresh">
          <svg class="icon-refresh" aria-hidden="true">
            <use xlink:href="#icon-refresh"></use>
          </svg>
        </div>
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
    <div class="components-container">
      <div class="pixel-card" v-for="component in filteredComponents" :key="component.componentId">
        <CommonComponent :componentId="component.componentId" :componentName="component.componentName"
          @click="handleComponentClick(component)">
          <component :ref="component.name" :is="component.name" :componentId="component.componentId"
            :componentName="component.componentName" />
        </CommonComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/http/api';
import CommonComponent from '@/components/CommonComponent.vue';
// “小程序”导入
import MRBGroupScrap from '@/components/MRBGroupScrape.vue'
import MRBPartNumScrap from '@/components/MRBPartNumScrape.vue';
import MRBPartNumList from '@/components/MRBPartNumList.vue';

export default {
  name: 'KanbanView',
  components: {
    CommonComponent,
    // “小程序”注册
    MRBGroupScrap,
    MRBPartNumScrap,
    MRBPartNumList,
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
        {
          name: 'MRBPartNumScrap', // 组件名
          componentId: 54002, // 功能代码
          componentName: 'MRB料号报废资料查询' // 功能名称
        },
        {
          name: 'MRBPartNumList', // 组件名
          componentId: 54003, // 功能代码
          componentName: 'MRB料号资料列表查询' // 功能名称
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
     * 刷新
     */
    refresh() {
      this.searchValue = '';
      this.filteredComponents = this.components;
    },
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
  width: 100vw;
  background-color: #f0f0f0;

  .navbar {
    width: 98.25%;
    background-color: #fff;
    margin: 0 auto;
    padding: 5px;
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
      height: 2.7vh;
      padding: 4px;
      border: 2px solid #000;
      box-shadow: 2px 2px 0 #000;
      margin-right: 0.5vw;
      outline: none;
      font-size: calc(0.5rem + 0.35vw);
    }

    #refresh,
    #avatar {
      padding: 0.5vh 0.3vw 0.3vh;
      border: 2px solid #000;
      box-shadow: 2px 2px 0 #000;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      .icon-refresh,
      .icon-signOut {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    #refresh {
      margin-right: 1.5rem;
    }
  }

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
