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
 
          <el-form-item label="所属机构" prop="parentName">
            <el-input
              v-model="queryParams.parentName"
              placeholder="请输入所属机构"
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

          <el-form-item label="科室分类" prop="classifyName">
            <el-input
              v-model="queryParams.classifyName"
              placeholder="请输入科室分类"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

          <el-form-item label="科室类别" prop="categoryName">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="请输入科室类别"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

          <el-form-item label="科室全称" prop="fullName">
            <el-input
              v-model="queryParams.fullName"
              placeholder="请输入科室全称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item>

          <el-form-item label="科室简称" prop="shortName">
            <el-input
              v-model="queryParams.shortName"
              placeholder="请输入科室简称"
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


        <!-- table展示表格 -->
        <el-table
          v-loading="loading"
          :data="departmentList"
          style="margin-top: 6px"
        >

          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="60"
          />

          <el-table-column
            label="科室全称"
            align="center"
            key="fullName"
            prop="fullName"
            :show-overflow-tooltip="true"
          />

          <el-table-column 
          label="科室简称"
           key="shortName" 
           align="center"
          prop="shortName"
            :show-overflow-tooltip="true"
           >
           
          </el-table-column>

          <el-table-column
            label="所属机构"
            align="center"
            key="parentName"
            prop="parentName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="科室分类"
            align="center"
            key="classifyName"
            prop="classifyName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="科室类别"
            align="center"
            key="categoryName"
            prop="categoryName"
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
          @pagination="getDepartment"
        />
      </el-col>
    </el-row>
    <departmentManagementBox
      :boxShow="boxShow"
      :boxTitle="boxTitle"
      @cancel="cancel"
      :departmentList="row"
      @remoteData="remoteData"
    />
  </div>
</template>

<script>
  import { getDepartment } from './api/index'
  import { updateDepartment } from './api/index'
  import { deleteContent } from"./api/index"  


  
  import departmentManagementBox from "./components/departmentManagementBox.vue";

export default {
  components: {
    departmentManagementBox,
  },
  data() {
    return {
      loading: true, // 遮罩层
      boxShow: false, //新增修改弹出框
      boxTitle: "", //新增修改标题
      total: 0,
      departmentList: [],
      row:{},
      queryParams: {
        mechanism:"",
        regionalismName: "",
        classifyName: "",
        categoryName: "",
        fullName:"",
        shortName:"",
        pageNo: 1,
        pageSize: 10,
      },
    };
  },

  mounted() {
    this.getDepartment();
  },

  created() {
    
  },

  methods: {

    /** 查看按钮操作 */
    handleView(row) {
      // this.reset();
      const id = row.id;
      updateDepartment(id).then(response => {
        this.row = response.data;
        this.boxShow = true;
        this.title = "修改数据";
        this.isShow = false
      });
    },
    remoteData() {
      this.getDepartment(); //baocun  yemian  baocun   haole
    },


    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const id = row.id;
      updateDepartment(id).then(response => {
        this.row = response.data;
        this.boxShow = true;
        this.title = "修改科室数据";
      });
    },

      /** 删除按钮操作 */
    handleDelete(row) {

      const id = row.id;
      
      this.$modal
        .confirm('是否确认删除科室id为"' + id + '"的数据项?')
        .then(function () {
          return deleteContent(id);
          // console.log("1111");
        })
        .then(() => {
          this.getDepartment();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },

    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增";
    },

    cancel() {
      this.boxShow = false;
    },

    /** 查询用户列表 */
    getDepartment() {
      this.loading = true;
      getDepartment(this.queryParams).then((response) => {
        this.departmentList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    handleQuery() {
        this.queryParams.pageNo = 1;
        this.getDepartment();
    },

  },
};
</script>

<style lang="less" scoped></style>
