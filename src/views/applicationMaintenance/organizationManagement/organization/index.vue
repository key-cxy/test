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
          label-width="100px"
        >

          <el-form-item label="所属组织机构" prop="organizationName">
            <el-input
              v-model="queryParams.organizationName"
              placeholder="请输入所属组织机构"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

           <el-form-item label="所属行政区划" prop="regionalismName">
            <el-input
              v-model="queryParams.regionalismName"
              placeholder="请输入所属行政区划"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

          <el-form-item label="多维组织名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入多维组织名称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

          <el-form-item>
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
          </el-form-item>

        </el-form>

        <el-table v-loading="loading" :data="userList" style="margin-top: 6px">

          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="60"
          />
          
          <el-table-column
            label="多维组织简称"
            align="center"
            key="shortName"
            prop="shortName"
            :show-overflow-tooltip="true"
          />

          <el-table-column 
          label="多维组织全称" 
          key="fullName" 
          prop="fullName"
          align="center">
          </el-table-column>

          <el-table-column
            label="上级组织机构"
            align="center"
            key="parentName"
            prop="parentName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="所属行政区划"
            align="center"
            key="regionalismName"
            prop="regionalismName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="创建时间"
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
                  @click="handleView(scope.row)"
                  v-hasPermi="['system:user:update']"
                  >查看</el-button
                >
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
          @pagination="userList"
        />
      </el-col>
    </el-row>
    <organizationBox :boxShow="boxShow" :boxTitle="boxTitle" @cancel="cancel" :getList="row"  @remoteData="remoteData" />
  </div>
</template>

<script>
import { getUserData } from "./api/index";
import { getOrganization } from "./api/index";
import { deleteContent } from"./api/index"


import organizationBox from "./components/organizationBox.vue";

export default {

  components: {
    organizationBox,
  },

  data() {
    return {
      boxShow: false, //新增修改弹出框
      boxTitle: "", //新增修改标题
      total: 0,
      userList:[],
      row:{},
      queryParams: {
        organizationName: "",
        regionalismName: "",
        name: "",
        pageNo: 1,
        pageSize: 10,
      },
    };
  },

  mounted() {

  },

  created() {
    this.getUserData();
  },

  methods: {

    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增";
    },

    cancel() {
      this.boxShow = false;
    },

    handleQuery() {
      this.queryParams.pageNo = 1;
        this.getUserData()
    },

    /** 查询用户列表 */
    getUserData() {
      this.loading = true;
      getUserData(this.queryParams).then((response) => {
        this.userList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const id = row.id;
      getOrganization(id).then(response => {
        this.row = response.data;
        this.boxShow = true;
        this.title = "修改数据";
      });
    },

    remoteData() {
      this.getUserData(); //baocun  yemian  baocun   haole
    },

    /** 删除按钮操作 */
    handleDelete(row) {

    console.log(row,"row");

      const id = row.id;

      console.log(id,"id");
      console.log(row.id,"row.id");
      
      this.$modal
        .confirm('是否确认删除组织id为"' + id + '"的数据项?')
        .then(function () {
          return deleteContent(id);
          // console.log("1111");
        })
        .then(() => {
          this.getUserData();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },


  },
};
</script>

<style lang="less" scoped></style>
