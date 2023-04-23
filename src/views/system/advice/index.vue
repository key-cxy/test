<template>
    <div>
      <el-tabs  style="height: 200px;margin-left: 20px" @tab-click="handleClick">
        <el-tab-pane label="公众审批意见" :value="1">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                         v-hasPermi="['system:approveView:add']">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="postList">
            <el-table-column label="编号" align="center" prop="id" />
            <el-table-column label="审批意见" align="center" prop="view" />
            <el-table-column label="管理用户" align="center" prop="creatorName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
              <el-row>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                           v-hasPermi="['system:approveView:update']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                           v-hasPermi="['system:post:delete']">删除</el-button>
</el-row>
            </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                      @pagination="getList"/>
        </el-tab-pane>
        <el-tab-pane label="个人审批意见" :value="2">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              >新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="postList">
            <el-table-column label="编号" align="center" prop="id" />
            <el-table-column label="审批意见" align="center" prop="view" />
            <el-table-column label="管理用户" align="center" prop="creatorName" />
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
        </el-tab-pane>
      </el-tabs>

      <!-- 添加或修改审批意见对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="审批意见" prop="view">
            <el-input v-model="form.view" placeholder="请输入岗位名称" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="dict in typeList" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                {{dict.label}}</el-radio>
            </el-radio-group>
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
  import {listAdvice,delAdvice,addAdvice,updateAdvice} from "@/api/system/advice"
  export default {
    name: 'index',
    data() {
      return {
        tabPosition: 'left',
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        postList: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          type: 0
        },
        // 显示搜索条件
        showSearch: true,
        typeList:[
          {
            value: 0,
            label: '公众'
          },
          {
            value: 1,
            label: '个人'
          }
        ],

        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        statusOptions: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          view: [
            { required: true, message: "审批意见不能为空", trigger: "blur" }
          ],
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods:{
      /** 查询岗位列表 */
      getList() {
        this.loading = true;
        listAdvice(this.queryParams).then(response => {
          this.postList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      reset() {
        this.form = {
          type: 0,
          view: undefined,
        };
        this.resetForm("form");
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加审批意见";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.form = row;
        this.open = true;
        this.title = "修改审批意见";
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateAdvice(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addAdvice(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除名称为"' + row.view + '"的数据项?').then(function() {
          return delAdvice(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },

      handleClick(tab, event) {
        console.log(tab, event);
        this.queryParams.type = tab.index
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
