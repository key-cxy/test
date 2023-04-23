<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="groupList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="userId" label="编号" width="100"></el-table-column>
      <el-table-column prop="nickName" label="姓名" width="200"></el-table-column>
      <el-table-column prop="loginAccount" label="账号" width="200"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="loginTime" label="最近登录时间" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="账号状态" width="100">
        <template slot-scope="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所在部门"></el-table-column>
      <el-table-column prop="workGroupVOS" label="用户组" width="300">
        <template slot-scope="scope">
            <span style="padding-left: 5px" v-for="(item,index) in scope.row.workGroupVOS" :key="index">
              {{item.name}}
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="200"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {listRoleUser} from "@/api/system/role"
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  import {CommonStatusEnum} from '@/utils/constants'
  import { getDictDatas, DICT_TYPE } from '@/utils/dict'
  import {listSimpleUsers} from "@/api/system/user";

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
          name: [
            { required: true, message: "角色组名称不能为空", trigger: "blur" }
          ],
          deptIds: [
            { required: true, message: "所属部门不能为空", trigger: "array" }
          ],
          email: [
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          status: [
            { required: true, message: "状态不能为空", trigger: "blur" }
          ]
        },

        // 枚举
        CommonStatusEnum: CommonStatusEnum,
        // 数据字典
        statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      };
    },
    created() {
      this.getList();
      this.getDeptTree(0);
      // 获得用户列表
      listSimpleUsers().then(response => {
        this.users = response.data;
      });
    },
    methods: {

      /** 查询角色组列表 */
      getList() {
        this.loading = true;
        listRoleUser(this.queryParams).then(response => {
          this.groupList = response.data.records
          this.total = response.data.total
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
          children: node.children
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
        this.getDeptTree(0);
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams ={
          name: undefined,
          roleName: undefined,
          status: undefined,
          pageNo: 1,
          pageSize: 10,
        }
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



    }
  };
</script>
