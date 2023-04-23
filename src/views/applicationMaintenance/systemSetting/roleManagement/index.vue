<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--查询-->
      <el-col :span="24" :gutter="5" :xs="24">

        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="90px"
        >

          <el-form-item label="超级管理员">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入人员姓名"
              clearable
              style="width: 210px"
            />
          </el-form-item>

          <el-form-item label="管理员" prop="sex">
            <el-select
              v-model="queryParams.sex"
              placeholder="请选择性别"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="男" :value="0" />
              <el-option :key="1" label="女" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="分级管理员">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              style="width: 210px"
            />
          </el-form-item>

          <el-form-item label="运维人员">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入身份证号"
              clearable
              style="width: 210px"
            />
          </el-form-item>

          <el-form-item label="第三方临时人员" prop="sex" label-width="100px">
            <el-select
              v-model="queryParams.sex"
              placeholder="请选择所属机构"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="一" :value="0" />
              <el-option :key="1" label="二" :value="1" />
            </el-select>
          </el-form-item>

          <!-- <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:create']"
              >新增</el-button
            >
          </el-form-item> -->

        </el-form>

        <el-table v-loading="loading" :data="userList" style="margin-top: 6px">

          <el-table-column
            label="超级管理员"
            align="center"
            type="index"
            width="100px"
          />

          <el-table-column
            label="管理员"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />

          <el-table-column label="分级管理员" key="status" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="运维人员"
            align="center"
            key="deptNameStr"
            prop="deptNameStr"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="第三方临时人员"
            align="center"
            key="count"
            prop="count"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:update']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:delete']"
                  >删除</el-button
                >
              </el-row>
            </template>
          </el-table-column>

        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <people :boxShow="boxShow" :boxTitle="boxTitle" @cancel="cancel" />
  </div>
</template>

<script>
import { getList } from "./api/index";
import people from "./components/people.vue";

export default {
  components: {
    people,
  },
  data() {
    return {
      boxShow: false, //新增修改弹出框
      boxTitle: "", //新增修改标题
      total: 0,
      queryParams: {
        name: "",
        phone: "",
        sex: "",
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {},
  created() {},
  methods: {
    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增";
    },
    cancel() {
      this.boxShow = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
