<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <CommonAside></CommonAside>
            </el-aside>
            <el-container>
                <el-header>
                    <CommonHeader></CommonHeader>
                </el-header>
                <CommonTag></CommonTag>
                <el-main>
                  方法
                  <!-- <el-table :data="tableData">
                    <el-table-column prop="date" label="日期" width="140">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="120">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                  </el-table> -->
              </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
</script>
<style lang="less" scoped>
  .el-header {
    padding: 0;
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      }
    },
    components:{
        CommonAside,
        CommonHeader,
        // CommonTag,
    }
  };
</script>