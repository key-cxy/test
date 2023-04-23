<template>
  <div class="header-search" v-bind:title="msg">
    <svg-icon class-name="search-icon" icon-class="international" @click.stop="click" />
  </div>
</template>

<script>
  // fuse is a lightweight fuzzy-search module
  // make search results more in line with expectations
  import Fuse from 'fuse.js/dist/fuse.min.js'
  import path from 'path'

  export default {
    name: 'index',
    data() {
      return {
        msg: '返回门户页'
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      // this.searchPool = this.generateRoutes(this.routes)
      // console.log('headerSearch mounted',this.searchPool)
    },
    methods: {
      click() {
        this.$tab.closePage();
        // this.$router.push({path:'/'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-search {
    font-size: 0 !important;

    .search-icon {
      cursor: pointer;
      font-size: 18px;
      vertical-align: middle;
    }

    .header-search-select {
      font-size: 18px;
      transition: width 0.2s;
      width: 0;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }

    &.show {
      .header-search-select {
        width: 210px;
        margin-left: 10px;
      }
    }
  }
</style>
