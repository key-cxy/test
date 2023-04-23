<template>
  <div class="app-container">

    <el-row :gutter="24">

      <el-col :span="4">
        <div
          style="
            width: 90%;
            margin-left: 5%;
            height: 89vh;
            background-color: #f8f8f9;
            overflow-y: auto;
          "
        >
          <el-input
            prefix-icon="el-icon-search"
            style="margin-top: 10px; width: 90%; margin-left: 5%"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>

          <el-tree
            style="margin-top: 15px; background-color: #f8f8f9"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </el-col>

      <el-col :span="20">

        <el-form
          :model="queryParams"
          ref="queryForm"
          v-show="showSearch"
          :inline="true"
        >

          <el-form-item label="系统名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入角色名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>

        </el-form>

        <el-row :gutter="10" class="mb8">
          
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:subsystem:create']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="data">
          <el-table-column
            label="系统编号"
            align="center"
            prop="id"
            width="120"
          />
          <el-table-column
            label="系统名称"
            prop="name"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            label="系统类型"
            prop="type"
            :show-overflow-tooltip="true"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">内部系统</span>
              <span v-if="scope.row.type === 1">外部系统</span>
            </template>
          </el-table-column>
          <el-table-column label="登录密钥" prop="secret" width="150" />
          <el-table-column label="访问地址" prop="url" />
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
                  v-hasPermi="['system:subsystem:update']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:subsystem:delete']"
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
    <!-- 添加或修改系统对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="系统名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入系统名称" />
        </el-form-item>
        <el-form-item label="系统类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择系统类型">
            <el-option
              v-for="item in typeList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="系统类别" prop="parentSystemId">
          <el-select v-model="form.parentSystemId" placeholder="请选择系统类别">
            <el-option
              v-for="item in treeData"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="访问路径" prop="url">
          <el-input v-model="form.url" placeholder="请输入访问路径" />
        </el-form-item>
        <el-form-item label="系统logo">
          <!--          <el-input v-model="form.iconPath" placeholder="请输入系统logo路径" />-->
          <el-upload
            class="avatar-uploader"
            :http-request="UploadImage"
            :action="abc"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.iconPath" :src="imgPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="登录密钥" prop="secret" v-if="form.type === 1">
          <el-input
            v-model="form.secret"
            placeholder="请输入登录密钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
          />
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
import {
  handleList,
  addSubSystem,
  updateSubSystem,
  delSubSystem,
  handleTypeList,
  subsystemTreeByRole,
  uploadLogo,
} from "@/api/system/subSystem";

export default {
  name: "index",
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
      data: [],
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
      typeList: [
        {
          id: 0,
          name: "内部",
        },
        {
          id: 1,
          name: "外部",
        },
      ], // 内型列表
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      props: {
        value: "id",
        label: "name",
        children: "children",
        multiple: true,
        checkStrictly: true,
      },
      filterText: "",
      defaultProps: {
        label: "name",
        children: "children",
      },
      treeData: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "系统名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "系统类型不能为空", trigger: "change" },
        ],
        parentSystemId: [
          { required: true, message: "系统类别不能为空", trigger: "change" },
        ],
        url: [{ required: true, message: "访问路径不能为空", trigger: "blur" }],
        secret: [
          { required: true, message: "登录密钥不能为空", trigger: "blur" },
        ],
      },
      categoryList: [],
      imgPath: "",
      abc: "",
    };
  },
  created() {
    this.getList();
    this.getTreeList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getTreeList() {
      subsystemTreeByRole().then((res) => {
        if (res.code === 0) {
          this.treeData = res.data;
        }
      });
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      handleList(this.queryParams)
        .then((response) => {
          if (response.code == 0) {
            this.data = response.data.records;
            this.total = response.data.total;
            this.loading = false;
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.resetForm("form");
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        id: undefined,
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm("form");
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm("form");
      const id = row.id;
      this.form = { ...row };
      this.imgPath = this.form.iconPath;
      this.open = true;
      this.title = "修改角色";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSubSystem(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getTreeList();
            });
          } else {
            addSubSystem(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.getTreeList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项?')
        .then(function () {
          return delSubSystem(ids);
        })
        .then(() => {
          this.getList();
          this.getTreeList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleAvatarSuccess(res, file) {
      // this.form.iconPath = URL.createObjectURL(file.raw);
      console.log(file);
      // 使图片显示
      this.imgPath = URL.createObjectURL(file);
      return false;
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    UploadImage(item) {
      const fd = new FormData();
      fd.append("file", item.file);
      uploadLogo(fd).then((res) => {
        if (res.code === 200) {
          this.$message.success("上传成功");
          this.form.iconPath = res.data;
          this.imgPath = res.data;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.queryParams.id = data.id;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
