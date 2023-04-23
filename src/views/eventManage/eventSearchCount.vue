<template>
  <div class="container">
    <el-tabs value="name1" style="margin-left: 20px">
      <el-tab-pane label="事件" name="name1">
        <event-search class="tab-body"></event-search>
      </el-tab-pane>
<!--      <el-tab-pane label="咨询" name="name2">-->
<!--        <consulting-search class="tab-body"></consulting-search>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="暂存" name="name3">
        <temporary-save class="tab-body" />
      </el-tab-pane>
      <!--      <el-tab-pane label="旧案卷" name="name3">-->
      <!--        <old-event-search class="tab-body"></old-event-search >-->
      <!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import eventSearch from './eventSearch'
import consultingSearch from './consultingSearch'
import oldEventSearch from './oldEventSearch'
import temporarySave from './temporarySave.vue'
export default {
  components: {
    eventSearch,
    consultingSearch,
    temporarySave,
    oldEventSearch
  },
  data() {
    return {
      label: (h) => {
        return h('div', [
          h('span', '全部'),
          h('Badge', {
            props: {
              count: 3
            }
          })
        ])
      },
      operateType: ['tuihui', 'yanqi', 'guazhang', 'chexiaobanjie']
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.tab-body {
  overflow-y: auto;
  height: 80vh;
}
</style>
