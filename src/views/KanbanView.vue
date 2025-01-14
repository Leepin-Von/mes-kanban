<template>
  <div class="home">
    <div class="navbar">
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
      <el-col :span="6">
        <div class="pixel-card">
          <MRB />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MRB from '@/components/MRB.vue'

export default {
  name: 'KanbanView',
  components: {
    MRB
  },
  methods: {
    handleAvatarClick() {
      this.$router.push('/signIn')
      localStorage.removeItem('Authorization')
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
        width: 1.5em;
        height: 1.5em;
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
