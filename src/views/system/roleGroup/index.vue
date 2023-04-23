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
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="角色组" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入角色组" clearable @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['system:dept:create']">新增
            </el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>-->
<!--          </el-col>-->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-if="refreshTable" v-loading="loading" :data="groupList" row-key="id"
                  :default-expand-all="isExpandAll"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="角色组"  align="center" width="200"></el-table-column>
          <el-table-column prop="deptDOList" align="center" :show-overflow-tooltip="true"  label="所属部门">
            <template slot-scope="scope">
            <span style="padding-left: 5px" v-for="item in scope.row.deptDOList" :key="item.id">
              {{item.name}}
            </span>
            </template>
          </el-table-column>
          <el-table-column prop="roleCount"align="center" label="角色数量" width="100">
            <template slot-scope="scope">
              <a @click="goRole(scope.row)">{{scope.row.roleCount}}</a>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-row>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                         v-hasPermi="['system:dept:update']">修改
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete"
                         @click="handleDelete(scope.row)" v-hasPermi="['system:dept:delete']">删除
              </el-button>
</el-row>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                    @pagination="getList"/>
      </el-col>
    </el-row>
    <!-- 添加或修改角色组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色组名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色组名称"/>
            </el-form-item>
          </el-col>
          <el-col class="cascade_box" :span="24">
            <el-form-item label="所属部门" prop="deptIds">
              <!--              <treeselect :multiple="true" v-model="form.deptIds" :options="deptOptions" :normalizer="normalizer" placeholder="选择所属部门" />-->
              <el-cascader
                style="width: 400px"
                :options="deptOptions"
                :props="optionProps"
                v-model="form.deptIds"
                @change="changeDeptIds"
                :show-all-levels="false"
                clearable
              >
              </el-cascader>
              <div class="error" v-if="required">所属部门不能为空</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入描述"/>
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
  import { listDept, queryTree } from '@/api/system/dept'
  import { listRoleGroup, addRoleGroup, updateRoleGroup, delRoleGroup } from '@/api/system/roleGroup'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import { CommonStatusEnum } from '@/utils/constants'
  import { getDictDatas, DICT_TYPE } from '@/utils/dict'
  import { listSimpleUsers } from '@/api/system/user'
  import getPathById from '@/libs/getPathById.js'

  export default {
    name: 'index',
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
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
        title: '',
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
          status: undefined,
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: '角色组名称不能为空', trigger: 'blur' }
          ],
          deptIds: [
            // { required: true, message: '所属部门不能为空', trigger: 'change' },
          ],
          email: [
            {
              type: 'email',
              message: '\'请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        },
        required: false,
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
        optionProps: {
          value: 'id',
          label: 'name',
          children: 'children',
          checkStrictly: true,
          multiple: true
        }
      }
    },
    created() {
      this.getList()
      this.getDeptTree(0)
      // 获得用户列表
      listSimpleUsers().then(response => {
        this.users = response.data
      })
    },
    methods: {
      /** 查询角色组树 */
      getDeptTree(id) {
        queryTree(id).then(response => {
          this.data = [response.data]
        })
        listDept().then(response => {
          this.deptOptions = this.handleTree(response.data, 'id')
        })
      },
      /** 查询角色组列表 */
      getList() {
        this.loading = true
        listRoleGroup(this.queryParams).then(response => {
          this.groupList = response.data.records
          this.total = response.data.total
          this.loading = false
        })
      },
      /** 转换部门数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      changeDeptIds(deptIds){
        this.$set(this.form, 'deptIds', deptIds)
        if(deptIds.length === 0){
          this.required = true
        } else {
          this.required = false
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          deptIds: [],
          name: undefined,
          remark: undefined
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNo = 1
        this.getList()
        this.getDeptTree(0)
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.queryParams = {
          name: undefined,
          deptId: undefined,
          pageNo: 1,
          pageSize: 10
        }
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset()
        this.open = true
        this.title = '添加角色组'
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false
        this.isExpandAll = !this.isExpandAll
        this.$nextTick(() => {
          this.refreshTable = true
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        this.open = true
        this.title = '修改角色组'
        this.form = row
        let list = []
        row.deptDOList.forEach(i => {
          list.push(getPathById(this.deptOptions,i.id))
        })
        console.log(this.deptOptions)
        console.log(list)
        this.form.deptIds = list
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const arr = []
            if (this.form.deptIds.length) {
              this.form.deptIds.forEach(item => {
                arr.push(item[item.length - 1])
              })
              // this.form.deptIds = arr
            } else {
              this.required = true
              return
            }
            const param = {
              ...this.form,
            }
            param.deptIds = arr
            if (this.form.id !== undefined) {
              updateRoleGroup(param).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.required = false
                this.getList()
                this.getDeptTree(0)
              })
            } else {
              addRoleGroup(param).then(response => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.required = false
                this.getList()
                this.getDeptTree(0)
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
          return delRoleGroup(row.id)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleNodeClick(data) {
        this.queryParams.deptId = data.id
        this.getList()
      },
      goRole(row){
        this.$router.push({path:'role',query:{name: row.name}})
      }
    }
  }
</script>
<style lang="less" scoped>
  .error{
    color: #ff4949;
    font-size: 0.0625rem;
    line-height: 1;
    padding-top: 0.02083rem;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .cascade_box {
    /deep/.el-form-item__label:before {
      content: "*";
      color: #ff4949;
      margin-right: 4px;
    }
  }
</style>
