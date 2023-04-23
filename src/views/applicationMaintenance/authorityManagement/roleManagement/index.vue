<template>
  <div class="app-container">
<!--    <doc-alert title="功能权限" url="https://doc.iocoder.cn/resource-permission" />-->
<!--    <doc-alert title="数据权限" url="https://doc.iocoder.cn/data-permission" />-->
    <el-row>
      <el-col :span="4">
        <div style="width: 90%;margin-left: 5%;height: 89vh;background-color: #f8f8f9;overflow-y: auto">
          <el-input prefix-icon="el-icon-search"
                    style="margin-top: 10px;width: 90%;margin-left: 5%"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
          </el-input>

          <el-tree
            style="margin-top: 15px;background-color: #f8f8f9;"
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable size="small" style="width: 240px"
                      @keyup.enter.native="handleQuery"/>
          </el-form-item>
<!--          <el-form-item label="所属部门：">-->
<!--            <el-cascader-->
<!--              :options="DeptData"-->
<!--              :props="optionProps"-->
<!--              v-model="queryParams.deptId"-->
<!--              :show-all-levels="false"-->
<!--              @change="getCheckedNodes"-->
<!--              clearable-->
<!--            >-->
<!--            </el-cascader>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['system:role:create']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                       v-hasPermi="['system:role:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="roleList">
          <el-table-column
            alien="center"
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column align="center" label="角色编号" prop="id" width="100" />
          <el-table-column align="center" label="角色名称" prop="name" :show-overflow-tooltip="true" width="100" />
          <el-table-column align="center" label="上级角色" prop="parentName" :show-overflow-tooltip="true" width="100" />
          <el-table-column align="center" label="创建人" prop="creator" width="100" />
          <el-table-column align="center" label="角色绑定账号数" prop="roleAccountNum" width="100" />
          <el-table-column align="center" label="角色人员" prop="roleUserCount" width="100" />
          <el-table-column align="center" label="角色描述" prop="remark" />
          <el-table-column align="center" label="绑定部门" prop="deptName" :show-overflow-tooltip="true" width="100" />
          <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-row>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                           v-hasPermi="['system:role:update']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleMenu(scope.row)"
                           v-hasPermi="['system:permission:assign-role-menu']">菜单权限</el-button>
  <!--              <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleDataScope(scope.row)"-->
  <!--                         v-hasPermi="['system:permission:assign-role-data-scope']">数据权限</el-button>-->
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                           v-hasPermi="['system:role:delete']">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                    @pagination="getList"/>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="上级角色" prop="parentRoleId">
          <treeselect  v-model="form.parentRoleId" :options="data" :normalizer="normalizer"  placeholder="选择上级角色" />
        </el-form-item>
<!--        <el-form-item label="绑定部门" prop="deptId">-->
<!--&lt;!&ndash;          <treeselect :multiple="true"  v-model="form.deptId" :options="DeptData" :normalizer="normalizer"  placeholder="选择绑定部门" />&ndash;&gt;-->
<!--          <el-cascader-->
<!--            v-model="form.deptIdTemp"-->
<!--            :options="DeptData"-->
<!--            :props="props"-->
<!--            clearable></el-cascader>-->
<!--        </el-form-item>-->
        <el-form-item label="子系统权限" prop="subsystemId">
          <treeselect :multiple="true" v-model="form.subsystemId" :options="systemTree" :normalizer="normalizer"  placeholder="选择子系统权限" />
<!--          <el-cascader-->
<!--            v-model="form.subsystemIdTemp"-->
<!--            :options="systemTree"-->
<!--            :props="props"-->
<!--            clearable></el-cascader>-->
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的数据权限对话框 -->
    <el-dialog title="分配数据权限" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="form.code" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeDictDatas"
              :key="parseInt(item.value)"
              :label="item.label"
              :value="parseInt(item.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope === SysDataScopeEnum.DEPT_CUSTOM">
          <el-checkbox :checked="!form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动(选中父节点，自动选择子节点)</el-checkbox>
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            ref="dept"
            node-key="id"
            :check-strictly="form.deptCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的菜单权限对话框 -->
    <el-dialog :title="title" :visible.sync="openMenu" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
<!--        <el-form-item label="角色标识">-->
<!--          <el-input v-model="form.code" :disabled="true" />-->
<!--        </el-form-item>-->
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menu" node-key="id"
              :check-strictly="form.menuCheckStrictly" empty-text="加载中，请稍后" :props="defaultProps"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenu">确 定</el-button>
        <el-button @click="cancelMenu">取 消</el-button>
      </div>
    </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  exportRole,
  getRole,
  listRole,
  updateRole,
  listRoleGroup,
  getTree,
  getSubsystemTree
} from "@/api/system/role";
import {listSimpleMenus} from "@/api/system/menu";
import {assignRoleMenu, listRoleMenus, assignRoleDataScope} from "@/api/system/permission";
import {listSimpleDepts} from "@/api/system/dept";
import {CommonStatusEnum, SystemDataScopeEnum} from "@/utils/constants";
import {DICT_TYPE, getDictDatas} from "@/utils/dict";
import { listDept, queryTree } from '@/api/system/dept'
import { getDeptTreeList } from "@/api/sizeclass/large";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import getPathById from '@/libs/getPathById.js'

export default {
  name: "Role",
  components: { Treeselect },
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 是否显示弹出层（菜单权限）
      openMenu: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [], // 部门属性结构
      depts: [], // 部门列表
      groupList:[], // 角色组列表
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        status: undefined,
        deptId: undefined,
        roleGroupName: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        label: "name",
        children: "children"
      },
      props:{
        value: 'id',
        label: 'name',
        children: "children",
        multiple: true,
        checkStrictly: true
      },
      filterText: '',
      data: [],
      DeptData: [],
      systemTree: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        // parentRoleId: [
        //   { required: true, message: "上级角色不能为空", trigger: "blur" }
        // ],
        // deptId: [
        //   { required: true, message: "绑定部门不能为空", trigger: "blur" }
        // ],
        // subsystemId: [
        //   { required: true, message: "子系统权限不能为空", trigger: "blur" }
        // ],
      },

      // 枚举
      SysCommonStatusEnum: CommonStatusEnum,
      SysDataScopeEnum: SystemDataScopeEnum,
      // 数据字典
      roleTypeDictDatas: getDictDatas(DICT_TYPE.SYSTEM_ROLE_TYPE),
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      dataScopeDictDatas: getDictDatas(DICT_TYPE.SYSTEM_DATA_SCOPE),

      // 控制所属角色组是否显示
      groupShow: true,

      optionProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true,
      },

    };
  },
  created() {
    // if(this.$route.query.name){
    //   this.queryParams.roleGroupName = this.$route.query.name
    // }
    this.getList();
    this.getDeptTree()
    // this.getTreeList()
    this.getSubsystemTree()
  },
  methods: {
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
    getTreeList() {
      getDeptTreeList()
        .then((response) => {
          if (response.code == 200) {
            this.DeptData = [response.data];
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    getSubsystemTree() {
      getSubsystemTree()
        .then((response) => {
          if (response.code == 0) {
            this.systemTree = response.data;
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    getCheckedNodes(value) {
      this.queryParams.deptId = value[value.length - 1];
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.queryParams.parentRoleId = data.id
      this.getList()
    },
    getDeptTree() {
      getTree().then(response => {
        this.data = response.data
      })
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, 'id')
      })
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      // this.addDateRange(this.queryParams, [
      //   this.dateRange[0] ? this.dateRange[0] + ' 00:00:00' : undefined,
      //   this.dateRange[1] ? this.dateRange[1] + ' 23:59:59' : undefined,
      // ])
      listRole(this.queryParams).then(
        response => {

          this.roleList = response.data.records;
          console.log("roleList",this.roleList)
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 角色状态修改
    handleStatusChange(row) {
      // 此时，row 已经变成目标状态了，所以可以直接提交请求和提示
      let text = row.status === CommonStatusEnum.ENABLE ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.name + '"角色吗?').then(function() {
          return changeRoleStatus(row.id, row.status);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          // 异常时，需要将 row.status 状态重置回之前的
          row.status = row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE
              : CommonStatusEnum.ENABLE;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 取消按钮（菜单权限）
    cancelMenu() {
      this.openMenu = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.deptExpand = true;
      this.deptNodeAll = false;
      this.form = {
        id: undefined,
        name: undefined,
        code: undefined,
        parentRoleId: undefined,
        sort: 0,
        deptIdTemp: [],
        deptId: [],
        subsystemId: [],
        menuIds: [],
        dataScope: undefined,
        deptCheckStrictly: false,
        menuCheckStrictly: true,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = undefined
      this.queryParams.parentRoleId = undefined
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type === 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type === 'dept') {
        // this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
        this.$refs.dept.setCheckedNodes(value ? this.depts: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = value;
      } else if (type === 'dept') {
        this.form.deptCheckStrictly = !value;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form = {}
      this.groupShow = true
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      this.form = {...row};
      // let list = []
      // row.deptId.forEach(i => {
      //   list.push(getPathById(this.DeptData,i))
      // })
      // console.log('343',list)
      // this.form.deptIdTemp = list
      // let list1 = []
      // row.subsystemId.forEach(i => {
      //   list1.push(getPathById(this.systemTree,i))
      // })
      // console.log('3434',list1)
      // this.form.subsystemIdTemp = list1
      this.open = true;
      this.title = "修改角色";
    },
    /** 分配菜单权限操作 */
    handleMenu(row) {
      this.title = "菜单权限"
      this.reset();
      const id = row.id
      // 处理了 form 的角色 name 和 code 的展示
      this.form.id = id;
      this.form.name = row.name;
      this.form.code = row.code;
      // 打开弹窗
      this.openMenu = true;
      // 获得菜单列表
      console.log("row",row)
      let subsystemIds = row.subsystemId.join(",")
      console.log('subsystemIds',subsystemIds)
      listSimpleMenus({ subsystemIds: subsystemIds}).then(response => {

        if(response.data == "")  this.$modal.msgWarning("子系统没有菜单权限")
        // 处理 menuOptions 参数
        this.menuOptions = [];
        this.menuOptions.push(...this.handleTree(response.data, "id"));
        // 获取角色拥有的菜单权限
        listRoleMenus(id).then(response => {
          // 设置为严格，避免设置父节点自动选中子节点，解决半选中问题
          this.form.menuCheckStrictly = true
          // 设置选中
          this.$refs.menu.setCheckedKeys(response.data);
          // 设置为非严格，继续使用半选中
          this.form.menuCheckStrictly = false
        })
      });

    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      // 处理了 form 的角色 name 和 code 的展示
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.code = row.code;
      // 打开弹窗
      this.openDataScope = true;
      // 获得部门列表
      listSimpleDepts().then(response => {
        // 处理 deptOptions 参数
        this.deptOptions = [];
        this.deptOptions.push(...this.handleTree(response.data, "id"));
        this.depts = response.data;
        // this.deptIds = response.data.map(x => x.id);
        // 获得角色拥有的数据权限
        getRole(row.id).then(response => {
          this.form.dataScope = response.data.dataScope;
          this.$refs.dept.setCheckedKeys(response.data.dataScopeDeptIds, false);
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log('aaa',this.form)
          // const arr = []
          // if (this.form.deptIdTemp.length) {
          //   this.form.deptIdTemp.forEach(item => {
          //     arr.push(item[item.length - 1])
          //   })
          // }
          // this.form.deptId = arr
          // const arr1 = []
          // if (this.form.subsystemIdTemp.length) {
          //   this.form.subsystemIdTemp.forEach(item => {
          //     arr1.push(item[item.length - 1])
          //   })
          // }
          // this.form.subsystemId = arr1
          console.log('123',this.form)
          if (this.form.id !== undefined) {
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.id !== undefined) {
        assignRoleDataScope({
          roleId: this.form.id,
          dataScope: this.form.dataScope,
          dataScopeDeptIds: this.form.dataScope !== SystemDataScopeEnum.DEPT_CUSTOM ? [] :
              this.$refs.dept.getCheckedKeys()
        }).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 提交按钮（菜单权限） */
    submitMenu: function() {
      if (this.form.id !== undefined) {
        assignRoleMenu({
          roleId: this.form.id,
          menuIds: [...this.$refs.menu.getCheckedKeys(), ...this.$refs.menu.getHalfCheckedKeys()]
        }).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openMenu = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {

      const ids = row.id || this.ids;
      const name = row.name || this.name;

      this.$modal.confirm('是否确认删除角色名称为"' + name + '"的数据项?').then(function() {
          return delRole(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const ttt = this.queryParams;
      const that = this
      this.$modal.confirm('是否确认导出所有角色数据项?').then(function() {
          that.exportLoading = true;
          return exportRole(ttt);
        }).then(response => {
          this.$download.excel(response, '角色数据.xls');
          this.exportLoading = false;
      }).catch(() => {
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
