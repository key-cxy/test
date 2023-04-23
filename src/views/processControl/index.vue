<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="问题来源" prop="name">
        <el-select v-model="queryParams.problemSourceId" style="width: 188px">
          <el-option v-for="item in problemSourcelist" :label="item.procDefName" :value="item.id" :key="item.id">{{ item.procDefName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型" prop="name">
        <el-select v-model="queryParams.operateType" style="width: 188px">
          <el-option v-for="item in dictDatalist" :value="item.value" :label="item.label" :key="item.value">{{ item.label }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间：">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                  >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="问题来源" align="center" prop="problemSourceName" />
      <el-table-column label="更新人" align="center" prop="updaterName" />
      <el-table-column label="添加时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">正常需审核</span>
          <span v-if="scope.row.status === 1">停用无需审核</span>
        </template>
      </el-table-column>
      <el-table-column label="流程节点" align="center" prop="eventNode" />
      <el-table-column label="操作" align="center" prop="operateType" >
        <template slot-scope="scope">
          <span v-if="scope.row.operateType === 'tuihui'">退回</span>
          <span v-if="scope.row.operateType === 'yanqi'">延期</span>
          <span v-if="scope.row.operateType === 'guazhang'">挂账</span>
          <span v-if="scope.row.operateType === 'chexiaobanjie'">撤销办结</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定流程实例" align="center" prop="createTime" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdateStatus(scope.row)">
            <span v-if="scope.row.status === 0" style="color: red">禁用</span>
            <span v-if="scope.row.status === 1">启用</span>
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <Modal
      v-model="showModal"
      :title="modalTitle"
      footer-hide
      @on-cancel="handleCloseModal"
    >
      <Form
        ref="refModalForm"
        :model="modalForm"
        :rules="rules"
        :label-width="130"
      >
        <FormItem label="问题来源：" prop="problemSourceId">
          <el-select v-model="modalForm.problemSourceId" style="width: 300px" @change="selectProcDefKey">
            <el-option v-for="item in problemSourcelist" :label="item.name" :value="item.id" :key="item.id">{{ item.name }}</el-option>
          </el-select>
        </FormItem>
        <FormItem label="绑定流程实例：">
          <el-input v-model="modalForm.procDefName" disabled style="width: 300px"></el-input>
        </FormItem>
        <FormItem label="流程节点：" prop="eventNode">
          <Select v-model="modalForm.eventNode" style="width: 300px">
            <Option v-for="(item,index) in eventNodeList" :label="item" :value="item" :key="index" ></Option>
          </Select>
        </FormItem>
        <FormItem label="节点操作：" prop="operateType" >
          <el-select v-model="modalForm.operateType" style="width: 300px" @change="getBpm">
            <el-option v-for="item in dictDatalist" :value="item.value" :label="item.label" :key="item.value">{{ item.label }}</el-option>
          </el-select>
        </FormItem>
        <FormItem label="绑定退回流程：" prop="subProcDefKey">
          <el-select v-model="modalForm.subProcDefKey" style="width: 300px" >
            <el-option v-for="item in bpmList" :value="item.procDefKey" :label="item.procDefName" :key="item.procDefKey">{{ item.procDefName }}</el-option>
          </el-select>
        </FormItem>
        <FormItem label="当前状态：" prop="status">
          <RadioGroup v-model="modalForm.status">
            <Radio label="0">开启</Radio>
            <Radio label="1">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal">取 消</Button>
          <Button type="primary" @click="handleSubmit" style="margin-left: 20px"
          >确 定</Button
          >
        </FormItem>
      </Form>
    </Modal>
    <!--表单配置详情-->
  </div>
</template>

<script>
  import {
    handleList,
    handleDelete,
    handleProblemSource,
    handleGetDictData,
    listEventNodeByPSId,
    getBpmByType,
    handleAdd,
    handleUpdate,
    handleUpdateStatus} from "@/api/processControl/index";

  export default {
    name: "index",
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        //列表
        list: [],
        problemSourcelist: [],
        dictDatalist: [],
        eventNodeList: [],
        bpmList: [],
        // 查询参数
        queryParams: {
          pageNo: 1,
          pageSize: 10,
          name: null,
        },
        showModal: false,
        modalTitle: "",
        modalForm: {
          eventNode: ""
        },
        // 1.新增 2.编辑 3.查看
        formType: 1,
        rules: {
          problemSourceId: [
            {
              required: true,
              message: "问题来源不可为空",
              trigger: "blur",
              type: "number"
            }
          ],
          eventNode: [
            {
              required: true,
              message: "流程节点不可为空",
              trigger: "blur",
              type: "string"
            }
          ],
          operateType: [
            {
              required: true,
              message: "节点操作不可为空",
              trigger: "blur",
              type: "string"
            }
          ],
          subProcDefKey: [
            {
              required: true,
              message: "退回流程不可为空",
              trigger: "blur",
              type: "string"
            }
          ],
          status: [
            { required: true,type: 'string', message: '状态不能为空', trigger: 'change' }
          ],
        },
        eventNodeShow: false
      };
    },
    created() {
      this.getList();
      this.getProblemSource();
      this.getDictData();
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        // 处理查询参数
        let params = {...this.queryParams};
        if (this.queryParams.dataRange) {
          params.beginTime = this.queryParams.dataRange[0]
          params.endTime = this.queryParams.dataRange[1]
        }
        // 执行查询
        handleList(params).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      getProblemSource() {
        // 执行查询
        handleProblemSource().then(response => {
          this.problemSourcelist = response.data;
        });
      },
      getDictData() {
        // 执行查询
        handleGetDictData().then(response => {
          this.dictDatalist = response.data;
        });
      },
      selectProcDefKey(value){
        this.modalForm.mainProcDefKey = null
        this.modalForm.procDefName = null
        let a = this.problemSourcelist.find((ele)=>{
          return parseInt(ele.id) === value
        });
        this.modalForm.mainProcDefKey = a.procDefKey
        this.modalForm.eventNode = ''
        this.modalForm.procDefName = a.procDefName
        listEventNodeByPSId({procDefKey: a.procDefKey}).then(res =>{
          this.eventNodeList = res.data
        })
      },
      getBpm(value){
        getBpmByType({operateType: value}).then(res =>{
          this.bpmList = res.data
        })
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
        }
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 详情按钮操作 */
      handleUpdateStatus(row) {
        const param = {
          ids: row.id,
          status: row.status === 1 ? 0 : 1,
        }
        handleUpdateStatus(param)
          .then(response => {
            if (response.code == 200) {
              this.$modal.msgSuccess("修改成功");
              this.getList();
            }
          })
          .catch(() => {
            this.$Message.error("修改状态失败！");
          });
      },
      clearRules() {
        this.$refs['refModalForm'].resetFields()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.modalTitle = "新增";
        this.formType = 1
        this.modalForm = {
          status: '0'
        };
        this.showModal = true;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.clearRules()
        this.formType = 2
        this.modalTitle = '编辑'
        this.modalForm = { ...row }
        this.selectProcDefKey(row.problemSourceId)
        this.getBpm(row.operateType)
        this.modalForm.eventNode = row.eventNode
        this.modalForm.status = row.status.toString()
        this.showModal = true;
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const param ={
          ids: row.id
        };
        this.$modal.confirm('是否确认删除问题来源为"' + row.problemSourceName + '"的数据项?').then(function() {
          return handleDelete(param);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleCloseModal() {
        this.modalForm = {};
        this.showModal = false;
      },
      handleSubmit() {
        this.$refs['refModalForm'].validate((valid) => {
          if (valid) {
            if (this.formType === 1) {
              const param = {
                ...this.modalForm,
              }
              handleAdd(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success('新增成功!')
                    this.handleCloseModal()
                    this.getList()
                  } else {
                    this.$Message.error(response.message)
                  }
                })
                .catch((error) => {
                  this.$Message.error('新增失败!')
                  console.log(error)
                })
            } else {
              const param = {
                ...this.modalForm
              }
              handleUpdate(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success('更新成功!')
                    this.handleCloseModal()
                    this.getList()
                  } else {
                    this.$Message.error(response.data.message)
                  }
                })
                .catch((error) => {
                  this.$Message.error('更新失败!')
                  console.log(error)
                })
            }
          }
        })
      },
    }
  };
</script>
