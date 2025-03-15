<template>
  <div>
    <h2>This is QuillTestView.vue</h2>
    <el-form class="form-container" :model="form" label-position="right">
      <el-form-item label="评 论" label-width="80px"
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
      range: null,
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
h2 {
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