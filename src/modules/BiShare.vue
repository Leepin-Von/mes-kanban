<template>
  <div class="outter">
    <div class="bi_share_container">
      <router-link
        v-for="module in modules"
        :key="module.url"
        :to="`/home/share/${module.url}`"
        class="modules"
        target="_blank"
      >
        <span>{{ module.moduleName }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modules: [
        {
          moduleName: "加班现况数据",
          url: "overtime-statistics",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.outter {
  width: 100vw;
  box-sizing: border-box;

  .bi_share_container {
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
  }
}
</style>

