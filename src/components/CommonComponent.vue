<template>
  <div class="kanban-component-container">
    <div class="pixel-svg-btn" @click="handleClick">
      <h1>{{ componentId }}</h1>
      <svg aria-hidden="true">
        <use xlink:href="#icon-kanban"></use>
      </svg>
      <h2>{{ componentName }}</h2>
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    componentId: {
      type: Number,
      required: true
    },
    componentName: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.componentName);
    },
  },
}
</script>

<style lang="scss" scoped>
.kanban-component-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .pixel-svg-btn {
    cursor: pointer;
    transform: scale(1);
    transition: transform 0.25s;

    svg {
      fill: currentColor;
      overflow: hidden;
      width: calc(15rem + 2vw);
      height: calc(10rem + 2vh);
    }

    h1,
    h2 {
      text-align: center;
      margin-bottom: 0;
      flex-wrap: wrap;
    }

    h1 {
      font-size: calc(1.5rem + 0.5vw);
    }

    h2 {
      font-size: calc(1rem + 0.5vw);
    }

    &:hover {
      transform: scale(1.1);
      transition: transform 0.25s;
    }
  }

  // .icon {
  //   width: 1.5rem;
  //   height: 1.5rem;
  //   vertical-align: -0.35rem;
  //   fill: currentColor;
  //   overflow: hidden;
  // }
}
</style>