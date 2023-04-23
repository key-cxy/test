<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :gutter="5" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="90px"
        >
          <el-form-item label="用户组">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户组状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户组状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="启用" :value="0" />
              <el-option :key="1" label="禁用" :value="1" />
            </el-select>
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
            <!-- <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button> -->
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" style="margin-top: 6px">
          <el-table-column
            label="编号"
            align="center"
            type="index"
            width="60"
          />
          <el-table-column
            label="用户组"
            align="left"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="账号状态" key="status" align="center">
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
            label="所属部门"
            align="left"
            key="deptNameStr"
            prop="deptNameStr"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="用户组人员"
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
                >删除</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-row style="display: flex; justify-content: center">
          <el-col :span="18">
            <el-form-item label="用户组名" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入用户姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: center">
          <el-col :span="18">
            <el-form-item label="所属部门" prop="deptId">
              <treeselect
                :disabled="isEdit"
                v-model="addForm.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="请选择用户部门"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: center">
          <el-col :span="18">
            <el-form-item label="排序号" prop="sort">
              <el-input v-model="addForm.sort" placeholder="请输入排序号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: center">
          <el-col :span="18">
            <el-form-item label="更新人" prop="updaterId">
              <el-input
                v-model="updateUSer"
                disabled
                placeholder="请输入更新人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: center">
          <el-col :span="18">
            <el-form-item label="当前状态" prop="status">
              <el-radio-group v-model="addForm.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex; justify-content: center" v-if="isEdit">
          <el-col :span="18">
            <el-form-item label="配置用户">
              <el-select
                v-model="userIds"
                placeholder="请配置用户"
                clearable
                style="width: 100%"
                multiple
              >
                <el-option
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id"
                  v-for="item in disposeUserList"
                />
              </el-select>
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
import {
  importTemplate,
  listUser,
  resetUserPwd,
  updateUser,
} from "@/api/system/user";
import {
  listUserGroup,
  createUserGroup,
  changeUserStatus,
  delUserGroup,
  getUserGroup,
  getPeopleByDept,
  updateUserGroup
} from "@/api/system/userGroup";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listSimpleDepts, queryTree } from "@/api/system/dept";
import { CommonStatusEnum } from "@/utils/constants";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getBaseHeader } from "@/utils/request";
import Cookies from "js-cookie";

export default {
  name: "User",
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API + "/admin-api/" + "/system/user/import",
      },
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户组名不能为空", trigger: "blur" },
        ],
        deptId: [{ required: true, message: "所属部门必选", trigger: "blur" }],
        sort: [{ required: true, message: "排序号不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "请选择当前状态", trigger: "change" },
        ],
      },
      // 是否显示弹出层（角色权限）
      openRole: false,

      // 枚举
      SysCommonStatusEnum: CommonStatusEnum,
      // 数据字典
      statusDictDatas: getDictDatas(DICT_TYPE.COMMON_STATUS),
      sexDictDatas: getDictDatas(DICT_TYPE.SYSTEM_USER_SEX),
      addForm: {},
      updateUSer: Cookies.get("username"),
      isEdit: false,
      userIds: [],
      disposeUserList: [],
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getConfigKey("sys.user.init-password").then((response) => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    // 更多操作
    handleCommand(command, index, row) {
      switch (command) {
        case "handleUpdate":
          this.handleUpdate(row); //修改客户信息
          break;
        case "handleDelete":
          this.handleDelete(row); //红号变更
          break;
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleRole":
          this.handleRole(row);
          break;
        default:
          break;
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUserGroup(this.queryParams).then((response) => {
        this.userList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 + 岗位下拉 */
    getTreeselect() {
      queryTree().then((response) => {
        // 处理 deptOptions 参数
        this.deptOptions = [];
        this.deptOptions.push(...this.handleTree([response.data], "id"));
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === CommonStatusEnum.ENABLE ? "启用" : "停用";
      this.$modal
        .confirm("确认要" + text + "该用户组吗?")
        .then(function () {
          return changeUserStatus(row.id, row.status);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status =
            row.status === CommonStatusEnum.ENABLE
              ? CommonStatusEnum.DISABLE
              : CommonStatusEnum.ENABLE;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（角色权限）
    cancelRole() {
      this.openRole = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.addForm = {
        id: undefined,
        name: undefined,
        deptId: undefined,
        sort: undefined,
        status: '0',
      };
      this.disposeUserList = [];
      this.userIds = [];
      this.resetForm("addForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isEdit = false;
      // 获得下拉数据
      this.getTreeselect();
      // 打开表单，并设置初始化
      this.open = true;
      this.title = "新增用户组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id;
      this.isEdit = true;
      getUserGroup(id).then((response) => {
        this.addForm = response.data;
        this.addForm.status = this.addForm.status.toString()
        this.open = true;
        this.title = "修改用户组";
        this.userIds = [];
        response.data.userList.map(item => {
          this.userIds.push(item.id)
        })
        getPeopleByDept(response.data.deptId).then((res) => {
          if (res.code == 0) {
            this.disposeUserList = res.data;
          }
        });
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          this.addForm.status = parseInt(this.addForm.status)
          if (this.addForm.id !== undefined) {
            this.addForm.userIds = this.userIds;
            updateUserGroup(this.addForm).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            createUserGroup(this.addForm).then((response) => {
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除该用户组?")
        .then(function () {
          return delUserGroup(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
  },
};
</script>
<style scoped>
::v-deep .el-form-item__label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
::v-deep .el-form-item--medium .el-form-item__label {
  width: 110px !important;
}
::v-deep .el-form-item--medium .el-form-item__content {
  margin-left: 110px !important;
}
::v-deep .el-select {
  width: 100%;
}
</style>
