<template>
  <div>
    <div class="editor" ref="container"></div>
  </div>
</template>

<script>
import Quill from "quill"; // 引入富文本编辑器
import QuillMarkdown from "quilljs-markdown"; // 引入markdown扩展
import "quill/dist/quill.snow.css"; // 引入富文本编辑器的css样式

export default {
  name: "EditorComponent",
  emits: ["text-change"],
  expose: ["getContents"],
  data() {
    return {
      quill: null,
      quillMarkdown: null,
      options: {
        theme: "snow",
        modules: {
          toolbar: [
            ["clean"],
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "blockquote", "image"],
          ],
        },
      },
    };
  },
  mounted() {
    const container = this.$refs.container;
    const editorContainer = container.appendChild(
      document.createElement("div")
    );
    this.quill = new Quill(editorContainer, this.options);
    this.quillMarkdown = new QuillMarkdown(this.quill, {});
    this.quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      this.$emit("text-change", args);
    });
  },
  beforeUnmount() {
    if (this.quill) {
      this.quill = null;
      this.$refs.container.innerHTML = "";
    }
  },
  methods: {
    getContents() {
      const text = this.quill?.getText();
      const html = this.quill?.root.innerHTML;
      return { text, html };
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  width: 98%;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
}
</style>