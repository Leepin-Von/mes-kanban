<template>
  <v-form-designer :global-dsv="globalDsv" />
</template>

<script>
import { get, post } from '@/http/api';
export default {
  name: "VFormDesigner-module",
  data() {
    return {
      globalDsv: {
        this: this,
        url: "/forward",
      }
    }
  },
  methods: {
    get(url, params = {}) {
      return get(url, params);
    },
    post(url, params = {}) {
      return post(url, params);
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
</style>