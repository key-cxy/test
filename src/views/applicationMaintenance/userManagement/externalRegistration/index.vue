<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--查询-->
      <el-col :span="24" :gutter="5" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="90px">
          <el-form-item label="姓名">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable style="width: 210px" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="queryParams.name" placeholder="请输入手机号" clearable style="width: 210px" />
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker v-model="value1" type="datetime" value-format="yyyy-MM-dd HH:MM:SS" placeholder="选择注册时间"
              style="width: 210px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="dataList" style="margin-top: 6px">
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column label="姓名" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="手机号" key="phone" align="center" prop="phone">
          </el-table-column>
          <el-table-column label="注册时间" align="center" key="time" prop="time" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-row>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:update']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:delete']">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </el-col>
    </el-row>
    <externalRegistrationBox :boxShow="boxShow" :boxTitle="boxTitle" @cancel="cancel" />
  </div>
</template>

<script>


import { getList } from './api/index'
import externalRegistrationBox from './components/externalRegistrationBox.vue'


export default {
  components: {
    externalRegistrationBox
  },
  data() {
    return {
      boxShow: false,//新增修改弹出框
      boxTitle: "",//新增修改标题
      total: 0,
      loading:true,
      queryParams: {
        name: "",
        phone: "",
        sex: "",
        pageNo: 1,
        pageSize: 10,
      },
      dataList: [{
        name: "yzm", phone: "18325505265", time: "2023-02-23 14:46:58"
      }]

    };
  },
  mounted() {

  },
  created() {

  },
  methods: {
    handleUpdate() {
      this.boxShow = true;
      this.boxTitle = "修改"
    },
    cancel() {
      this.boxShow = false
    }
  }
};
</script>

<style lang="less" scoped></style>
