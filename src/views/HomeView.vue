<template>
  <div class="home">
    <div class="navbar">
      <svg
        class="icon-search"
        aria-hidden="true"
        v-show="
          this.$router.currentRoute.path !== '/home'
        "
      >
        <use xlink:href="#icon-search"></use>
      </svg>
      <el-tooltip
        class="item"
        effect="dark"
        content="输入 功能代码 或 功能名称 后回车，即可查询"
        placement="bottom"
        v-show="
          this.$router.currentRoute.path !== '/home'
        "
      >
        <input
          type="text"
          class="input-search"
          v-model="searchValue"
          placeholder="输入 功能代码 或 功能名称"
          @keyup.enter="searchComponents"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="刷新"
        placement="bottom"
        v-show="
          this.$router.currentRoute.path !== '/home'
        "
      >
        <div id="refresh" @click="refresh">
          <svg class="icon-refresh" aria-hidden="true">
            <use xlink:href="#icon-refresh"></use>
          </svg>
        </div>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="退出登录"
        placement="bottom"
      >
        <div id="avatar" @click="handleAvatarClick">
          <svg class="icon-signOut" aria-hidden="true">
            <use xlink:href="#icon-signOut"></use>
          </svg>
        </div>
      </el-tooltip>
    </div>
    <br />
    <modules-view v-if="this.$router.currentRoute.path === '/home'" />
    <router-view />
  </div>
</template>

<script>
import ModulesView from "./ModulesView.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "HomeView",
  components: {
    ModulesView,
  },
  data() {
    return {
      searchValue: "",
    };
  },
  computed: {
    ...mapState("components", ["components", "filteredComponents"]),
  },
  methods: {
    ...mapActions('components', ['filterComponents']),
    /**
     * 刷新
     */
    refresh() {
      this.searchValue = "";
      this.filterComponents("");
    },
    /**
     * 退出登录
     */
    handleAvatarClick() {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("Username");
      this.$router.push("/signIn");
    },
    /**
     * 查询功能代码或功能名称
     */
    searchComponents(e) {
      e = e || window.event;
      const value = this.searchValue.trim();
      if (e.keyCode == 13 && value) {
        this.filterComponents(value);
        this.searchValue = "";
      } else {
        this.filterComponents("");
        this.searchValue = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: linear-gradient(darkgray, lightgray, white);
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;

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
}
</style>