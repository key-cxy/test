<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <div style="width: 90%;margin-left: 5%;height: 89vh;background-color: #f8f8f9;overflow-y: auto">
          <el-input prefix-icon="el-icon-search"
                    style="margin-top: 10px;width: 90%;margin-left: 5%"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
          </el-input>

          <el-tree
            style="margin-top: 15px; background-color: #f8f8f9"
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            node-key="id"
            :highlight-current="true"
            :expand-on-click-node="false"
            :current-node-key="selectId"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
            highlight-current
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node showname"
              :title="node.label"
              v-text="node.label"
            >
            </span>
          </el-tree>

        </div>
      </el-col>
      <el-col :span="20">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入岗位名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
          <el-option v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="dict.label" :value="parseInt(dict.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['system:post:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['system:post:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList">
      <el-table-column label="岗位编码" align="center" prop="code" />
      <el-table-column label="岗位名称" align="center" prop="name" />
      <el-table-column label="岗位领导" align="center" prop="leaderUserName" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="人员列表" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.adminUserDOS" :key="index">{{item.nickname+ '，'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
<!--          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>-->
          <el-switch
            :value="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
              <el-row>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:post:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:post:delete']">删除</el-button>
</el-row>
            </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
      </el-col>
    </el-row>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <treeselect :disabled="form.id !== undefined"  v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="选择部门" />
        </el-form-item>
        <el-form-item label="岗位领导" prop="leaderUserId">
          <el-select v-model="form.leaderUserId" placeholder="请输入负责人" clearable style="width: 100%">
            <el-option v-for="item in users" :key="parseInt(item.id)" :label="item.nickname" :value="parseInt(item.id)" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
              {{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listPost, getPost, delPost, addPost, updatePost, exportPost,changeStatus } from "@/api/system/post";
import { queryTree,listDept } from "@/api/system/dept";
import {listSimpleUsers} from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {CommonStatusEnum} from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'

export default {
  name: "Post",
  components: { Treeselect },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        code: undefined,
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" }
        ]
      },

      // 枚举
      CommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      filterText: '',
      selectId: null,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      users:[],
      deptOptions:[]
    };
  },
  created() {
    this.getList();
    this.getDeptTree(0);
    // 获得用户列表
    listSimpleUsers().then(response => {
      this.users = response.data;
    });
    listDept().then(response => {
      this.deptOptions = this.handleTree(response.data, "id");
    });
  },
  methods: {
    /** 查询部门树 */
    getDeptTree(id){
      queryTree(id).then(response => {
        this.data = [response.data]
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        code: undefined,
        name: undefined,
        deptId: undefined,
        sort: 0,
        status: CommonStatusEnum.ENABLE,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        deptId: undefined,
        name: undefined,
        status: undefined
      },
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加岗位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改岗位";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$modal.confirm('是否确认删除岗位编号为"' + ids + '"的数据项?').then(function() {
          return delPost(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有岗位数据项?').then(() => {
          this.exportLoading = true;
          return exportPost(queryParams);
        }).then(response => {
          this.$download.excel(response, '岗位数据.xls');
          this.exportLoading = false;
      }).catch(() => {});
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
    // 修改状态
    changeStatus(row){
      console.log(row)
      const param = {
        id: row.id,
        status: row.status === 1 ? 0 : 1,
      }
      console.log(param)
      changeStatus(param)
        .then(response => {
          if (response.code == 200) {
            this.$Message.success(response.msg);
            this.getList();
            this.getDeptTree(0);
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("修改状态失败！");
        });
    }
  },
};
</script>
