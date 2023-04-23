<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发布日期" prop="releaseDate">
        <el-input
          v-model="queryParams.releaseDate"
          placeholder="请输入发布日期"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发布人" prop="publisher">
        <el-input
          v-model="queryParams.publisher"
          placeholder="请输入发布人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <!-- 搜索按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 新增按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:tenant:create']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!-- 刷新 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="groupList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="title"
        label="标题"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="releaseDate"
        label="发布日期"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="publisher"
        label="发布人"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mechanism"
        label="机构"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="department"
        label="科室"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="organization"
        label="多维组织"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:tenant:update']"
              >查看</el-button
            > 
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:tenant:delete']"
              >编辑</el-button
            >
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- </el-table> -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="发布日期" prop="releaseDate">
          <el-select
            v-model="form.releaseDate"
            placeholder="请输入发布日期"
            clearable
            size="small"
          >
            <el-option
              v-for="item in packageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发布人" prop="publisher">
          <el-input v-model="form.publisher" placeholder="请输入发布人" />
        </el-form-item>

        <el-form-item label="机构" prop="mechanism">
          <el-input v-model="form.mechanism" placeholder="请输入机构" />
        </el-form-item>

        <el-form-item
          v-if="form.id === undefined"
          label="科室"
          prop="department"
        >
          <el-input v-model="form.department" placeholder="请输入科室" />
        </el-form-item>

        <el-form-item
          v-if="form.id === undefined"
          label="多维组织"
          prop="organization"
        >
          <el-input v-model="form.organization" placeholder="请输入多维组织" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { createTenant, updateTenant, deleteTenant, getTenant, getTenantPage, exportTenantExcel } from "@/api/system/tenant";
// import {
//   getTitle,
//   getReleaseDate,
//   getPublisher,
//   getMechanism,
//   getDepartment,
//   getOrganization,
// } from "@/api/system/tenant";

//获取用户角色用户列表
import { listRoleUser } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { CommonStatusEnum } from "@/utils/constants";
import { getDictDatas, DICT_TYPE } from "@/utils/dict";
// 获取用户精简信息列表
// import { listSimpleUsers } from "@/api/system/user";

export default {
  name: "index",
  components: { Treeselect },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      groupList: [],
      // 角色组树选项
      deptOptions: [],
      // 用户下拉列表
      users: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 是否展开
      expand: false,
      // 状态数据字典
      statusOptions: [],
      packageList: [],
      // 查询参数
      queryParams: {
        name: undefined,
        roleName: undefined,
        status: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        releaseDate: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        publisher: [
          { required: true, message: "发布人不能为空", trigger: "blur" },
        ],
        mechanism: [
          { required: true, message: "机构不能为空", trigger: "blur" },
        ],
        department: [
          { required: true, message: "科室不能为空", trigger: "blur" },
        ],
        organization: [
          { required: true, message: "多维组织不能为空", trigger: "blur" },
        ],
      },

      // 枚举
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  created() {
    this.getList();
    // this.getDeptTree(0);
    // // 获得用户列表
    // getPublisher().then((response) => {
    //   this.getPublisher = response.data;
    // });
  },

  methods: {
    /** 查询角色组列表 */
    getList() {
      this.loading = true;
      listRoleUser(this.queryParams).then((response) => {
        this.groupList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deptIds: [],
        name: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
      // this.getDeptTree(0);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {
        name: undefined,
        roleName: undefined,
        status: undefined,
        pageNo: 1,
        pageSize: 10,
      };
      this.handleQuery();
    },

    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      // const id = row.id;
      // getTenant(id).then(response => {
      //   this.form = response.data;
      this.open = true;
      //   this.title = "修改租户";
      // });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateTenant(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createTenant(this.form).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },

    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加租户";
    },
  },
};
</script>
