<template>
  <el-upload
    class="upload-demo"
    action
    accept=".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.pdf"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :http-request="uploadFile"
    drag
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">
      只能上传 jpg / jpeg / png / doc / docx / xls / xlsx / txt / pdf
      文件，且不超过5MB（其中pdf文件不超过50MB）
    </div>
  </el-upload>
</template>

<script>
import { post, postFile } from "@/http/api";
import { unique } from "@/utils/ArrayUtils";

export default {
  data() {
    return {
      file: null,
      file_list: [],
    };
  },
  methods: {
    handleChange(file) {
      this.file = file;
    },
    handleRemove(file) {
      let url;
      this.file_list = this.file_list.filter((item) => {
        url = item.url;
        return item.name !== file.name;
      });
      post("/minio/remove", { url: url })
        .then((res) => {
          if (res.code === 200 && res.map.removed === true) {
            console.log(res.map.fileName);
            this.$notify.success({
              title: "删除成功",
              message: `【${file.name}】删除成功`,
            });
          } else {
            this.$notify.error({
              title: "删除失败",
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "删除失败",
            message: `删除文件失败，错误信息：${err}`,
          });
        });
    },
    beforeUpload(file) {
      const fileType = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      const whiteList = [
        "jpg",
        "jpeg",
        "png",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "txt",
        "pdf",
      ];
      if (!whiteList.includes(fileType)) {
        this.$message.error("上传文件格式不正确");
        return false;
      }
      const pdfSizeLimit = file.size / 1024 / 1024 < 50;
      if (!pdfSizeLimit && fileType === "pdf") {
        this.$message.error("上传的PDF文件大小不能超过50MB");
        return false;
      }
      const otherSizeLimit = file.size / 1024 / 1024 < 5;
      if (!otherSizeLimit) {
        this.$message.error("上传文件大小不能超过5M");
        return false;
      }
    },
    uploadFile() {
      const _this = this;
      const formData = new FormData();
      formData.append("file", _this.file.raw);
      postFile("/minio/upload", formData)
        .then((res) => {
          if (res.code === 200) {
            _this.file_list.push({ name: _this.file.name, url: res.map.url });
            this.file_list = unique(_this.file_list);
            this.$notify.success({
              title: "上传成功",
              message: `【${_this.file.name}】上传成功`,
            });
          } else {
            this.$notify.error({
              title: "上传失败",
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "上传失败",
            message: `上传文件失败！错误信息：${err}`,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.upload-demo {
  width: 30%;
}
</style>