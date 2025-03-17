<template>
  <div>
    <h2>QuillTestView.vue</h2>
    <p>下面是个表单，在这里测试一下是否可用</p>
    <el-form class="form-container" :model="form" label-position="right">
      <el-form-item label="测试一下" label-width="80px"
        ><editor-component
          ref="editor"
          @text-change="handleTextChange"
        ></editor-component
      ></el-form-item>
    </el-form>
  </div>
</template>

<script>
import EditorComponent from "@/components/EditorComponent.vue";
export default {
  components: {
    EditorComponent,
  },
  data() {
    return {
      form: {
        comment: null,
      },
    };
  },
  methods: {
    handleTextChange() {
      this.form.comment = this.$refs.editor.getContents();
    },
  },
};
</script>

<style lang="scss" scoped>
h2,
p {
  text-align: center;
}
::v-deep.form-container {
  .el-form-item {
    &__content {
      line-height: unset;
    }
  }
}
</style>