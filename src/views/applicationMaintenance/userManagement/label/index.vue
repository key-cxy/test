<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--查询-->
      <el-col :span="24" :gutter="5" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="90px">
          <el-form-item label="标签名称">
            <el-input v-model="queryParams.name" placeholder="请输入标签名称" clearable style="width: 210px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['system:user:create']">新增</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" style="margin-top: 6px">
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column label="标签名称" align="center" key="name" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="标签内容" key="status" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1"
                @change="handleStatusChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="标记机构数" align="center" key="deptNameStr" prop="deptNameStr"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="标记科室数" align="center" key="count" prop="count" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="标记多维组织数" align="center" key="count" prop="count" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="标记人员数" align="center" key="count" prop="count" :show-overflow-tooltip="true">
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
    <labelBox :boxShow="boxShow" :boxTitle="boxTitle" @cancel="cancel" />
  </div>
</template>

<script>


import { getList } from './api/index'
import labelBox from './components/labelBox.vue'


export default {
  components: {
    labelBox
  },
  data() {
    return {
      boxShow: false,//新增修改弹出框
      boxTitle: "",//新增修改标题
      total: 0,
      queryParams: {
        name: "",
        phone: "",
        sex: "",
        pageNo: 1,
        pageSize: 10,
      }

    };
  },
  mounted() {

  },
  created() {

  },
  methods: {
    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增"
    },
    cancel() {
      this.boxShow = false
    }
  }
};
</script>

<style lang="less" scoped></style>
