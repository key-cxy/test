<template>
  <div>
    <el-button type="primary" @click="getToken">获取token</el-button>
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
                  <el-table :data="tableData">
                    <el-table-column prop="date" label="日期" width="140">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="120">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                  </el-table>
              </el-main>
            </el-container>
        </el-container>
  </div>
</template>

<script>
import CommonAside from './components/CommonAside.vue'
import CommonHeader from './components/CommonHeader.vue'
import getToken from "@/api/token.js";
export default {
components:{
  CommonAside,
  CommonHeader
},
  methods:{
    //获取token
   async getToken(){
      try {
        const {data}=await getToken()
      localStorage.token=data
      this.$message.success('获取token成功')
      console.log(data)
      } catch (error) {
        this.$message.error('获取token失败')
      }
    }
  }
}
</script>

<style>

</style>