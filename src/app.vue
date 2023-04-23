<template>
  <a-config-provider :locale="$zhCN">
     <div id="app">
      <router-view  />
    </div>
  </a-config-provider>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
      isRouterAlive: true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false
      this.$nextTick(() =>{
        this.isRouterAlive = true
      })
    }
  },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style lang="less">
  html,
  body {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .ivu-select-dropdown {
    ul {
      max-width: 120px;
      padding-top: 8px;
      padding-left: 0;
      li {
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; /**不换行**/
        display: inline-block;
      }
    }
  }
  .custom-row {
    margin: 0 40px;
  }
  .el-table .cell {
    white-space: pre-line;
  }
</style>
