<template>
  <div class="app-container">
    <el-row>
<!--      <el-col :span="6">-->
<!--        <el-input-->
<!--          style="margin-top: 10px;width: 90%;margin-left: 5%"-->
<!--          placeholder="输入关键字进行过滤"-->
<!--          v-model="filterText">-->
<!--        </el-input>-->

<!--        <el-tree-->
<!--          class="filter-tree"-->
<!--          :data="data"-->
<!--          :props="defaultProps"-->
<!--          :highlight-current="true"-->
<!--          default-expand-all-->
<!--          :filter-node-method="filterNode"-->
<!--          @node-click="handleNodeClick"-->
<!--          ref="tree">-->
<!--        </el-tree>-->
<!--      </el-col>-->
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
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
                       v-hasPermi="['system:dept:create']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-if="refreshTable" v-loading="loading" lazy :load="load"  :data="tableData" row-key="id" :default-expand-all="isExpandAll"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="部门名称"></el-table-column>
          <el-table-column prop="leaderName" label="部门领导" :formatter="userNicknameFormat" width="200"/>
          <el-table-column prop="upDeptName" label="上级部门" width="200"></el-table-column>
          <el-table-column prop="upLeaderName" label="上级部门领导" width="200"></el-table-column>
          <el-table-column prop="sort" label="排序" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="200">
            <template slot-scope="scope">
<!--              <el-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" @click="changeStatus(scope.row)"></el-tag>-->
              <el-switch
                :value="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="changeStatus(scope.row)"
                >
              </el-switch>
            </template>
          </el-table-column>
<!--          <el-table-column label="创建时间" align="center" prop="createTime" width="200">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-row>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                         v-hasPermi="['system:dept:update']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
                         v-hasPermi="['system:dept:create']">新增</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete"
                         @click="handleDelete(scope.row)" v-hasPermi="['system:dept:delete']">删除</el-button>
</el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect :disabled="form.id !== undefined" @select="selectNode" v-model="form.parentId" :options="deptOptions" :normalizer="normalizer"  placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leaderUserId">
              <el-select v-model="form.leaderUserId" placeholder="请输入负责人" clearable style="width: 100%">
                <el-option v-for="item in users" :key="parseInt(item.id)" :label="item.nickname" :value="parseInt(item.id)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                  {{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept,queryTree,changeStatus } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {CommonStatusEnum} from '@/utils/constants'
import { getDictDatas, DICT_TYPE } from '@/utils/dict'
import {listSimpleUsers} from "@/api/system/user";
import handleTree from "@/libs/handleTree"

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      tableDataCopy : [],
      tableData : [],
      // 部门树选项
      deptOptions: [],
      // 用户下拉列表
      users: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 是否展开
      expand: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
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
    // this.getDeptTree();
    // 获得用户列表
    listSimpleUsers().then(response => {
      this.users = response.data;
    });
  },
  methods: {
    /** 查询部门树 */
    // getDeptTree(id){
    //   queryTree(id).then(response => {
    //     this.data = [response.data]
    //   })
    // },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(res => {
        this.deptList = handleTree(res.data,'id','parentId');
        // console.log(111,this.deptList)
        this.tableDataCopy = this.deptList || [] // 备份的全量数据
        this.tableData = JSON.parse(JSON.stringify(this.deptList)).map(item => { // 展示数据
          // hasChildren 表示需要展示一个箭头图标
          item.hasChildren = item.children && item.children.length > 0
          // 只展示一层
          // 如果有children数据，会自动加载，就不是懒加载了，也可以配置tree-props里面的children为其他字段
          item.children = null
          // 记住层级关系
          item.idList = [item.id]
          return item
        })
        this.loading = false;
      });
    },
    // 展开
    load (tree, treeNode, resolve) {
      // 层级关系备份
      const idCopy = JSON.parse(JSON.stringify(tree.idList))

      // 查找下一层数据
      let resolveArr = this.tableDataCopy
      let id
      // eslint-disable-next-line
      while (id = tree.idList.shift()) {
        const tarItem = resolveArr.find(item => item.id === id)
        tarItem.loadedChildren = true
        resolveArr = tarItem.children
      }

      // 处理下一层数据的属性
      resolveArr = JSON.parse(JSON.stringify(resolveArr))
      resolveArr.forEach(item => {
        item.hasChildren = item.children && item.children.length > 0
        item.children = null
        // 此处需要深拷贝，以防各个item的idList混乱
        item.idList = JSON.parse(JSON.stringify(idCopy))
        item.idList.push(item.id)
      })

      // 标识已经加载子节点
      tree.loadedChildren = true

      // 渲染子节点
      resolve(resolveArr)
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
    // 用户昵称展示
    userNicknameFormat(row, column) {
      if (!row.leaderUserId) {
        return '未设置';
      }
      for (const user of this.users) {
        if (row.leaderUserId === user.id) {
          return user.nickname;
        }
      }
      return '未知【' + row.leaderUserId + '】';
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
        parentId: undefined,
        name: undefined,
        sort: undefined,
        leaderUserId: undefined,
        phone: undefined,
        email: undefined,
        status: CommonStatusEnum.ENABLE,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams ={}
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row !== undefined) {
        this.form.parentId = row.id;
        this.form.parentCode = row.code
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
	        this.deptOptions = this.handleTree(response.data, "id");
      });
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
      this.reset();
      getDept(row.id).then(response => {
        this.form = response.data;
        if (this.form.parentId === 0) { // 无父部门时，标记为 undefined，避免展示为 Unknown
          this.form.parentId = undefined;
        }
        this.open = true;
        this.title = "修改部门";
      });
      listDept(row.id).then(response => {
	        this.deptOptions = this.handleTree(response.data, "id");
      });
    },
    // 树选择
    selectNode(node ,id){
      this.form.parentCode = node.code
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
        this.toggleExpandAll()
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
          return delDept(row.id);
        }).then(() => {
        this.toggleExpandAll()
          this.getList();
          this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('ddd',data)
      queryTree(data.id).then(response => {
        // this.deptList = this.handleTree(response.data, "id");
        this.deptList = [response.data]
        this.loading = false;
      });
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
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("修改状态失败！");
        });
    }
  }
};
</script>
