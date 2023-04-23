<template>
  <div>
    <el-tabs value="name1" style="margin-left: 20px">
      <el-tab-pane label="全部" name="name1">
        <aduit-table style="height: 90vh"></aduit-table>
      </el-tab-pane>
      <el-tab-pane label="返回审核" name="name2">
        <aduit-table v-bind:name="operateType[0]" class="tab-body"></aduit-table>
      </el-tab-pane>
      <el-tab-pane label="延期审核" name="name3">
        <aduit-table v-bind:name="operateType[1]" class="tab-body"></aduit-table>
      </el-tab-pane>
      <el-tab-pane label="挂账审核" name="name4">
        <aduit-table v-bind:name="operateType[2]" class="tab-body"></aduit-table>
      </el-tab-pane>
      <el-tab-pane label="撤销办结" name="name5">
        <aduit-table v-bind:name="operateType[3]" class="tab-body"></aduit-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import aduitTable from "./aduitTable";
    export default {
        name: "eventAudit",
      components:{
        aduitTable
      },
      data () {
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
          operateType:[
            'tuihui',
            'yanqi',
            'guazhang',
            'chexiaobanjie'
          ]
        }
      }
    }
</script>

<style scoped>
  .tab-body{
    overflow-y: auto;
    height: 80vh;
  }
</style>
