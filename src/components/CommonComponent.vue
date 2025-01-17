<template>
  <div class="kanban-component-container">
    <div class="pixel-svg-btn" @click="handleClick">
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
    }

    h2 {
      text-align: center;
    }

    &:hover {
      transform: scale(1.1);
      transition: transform 0.25s;
    }
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.35em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>