<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">-->
<!--      <el-form-item label="问题来源" prop="name">-->
<!--        <el-select v-model="queryParams.problemSourceId" style="width: 188px">-->
<!--          <el-option v-for="item in problemSourcelist" :label="item.procDefName" :value="item.id" :key="item.id">{{ item.procDefName }}</el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
<!--        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"-->
<!--        >新增</el-button>-->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="事件编号" align="center" prop="caseNo" />
      <el-table-column label="督办人" align="center" prop="supervisorName" />
      <el-table-column label="更新时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">启用</span>
          <span v-if="scope.row.status === 1">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <Button size="small" :type="scope.row.status === 0? 'primary': 'success'" @click="handleUpdateStatus(scope.row)">
            <span v-if="scope.row.status === 0">禁用</span>
            <span v-if="scope.row.status === 1">启用</span>
          </Button>
          <Button size="small" type="warning" style="margin-left: 10px" @click="handleView(scope.row)"
          >详情</Button>
          <Button size="small" type="error" style="margin-left: 10px" @click="handleDelete(scope.row)"
          >删除</Button>
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
        <FormItem label="事件编号：" prop="caseNo">
          <div>{{modalForm.caseNo}}</div>
        </FormItem>
        <FormItem label="事件来源：" prop="problemSourceId">
          <div>{{modalForm.problemSourceName}}</div>
        </FormItem>
        <FormItem label="问题来源级别：">
          <div v-if="modalForm.problemSourceLevel === 1">市级</div>
          <div v-if="modalForm.problemSourceLevel === 2">区级</div>
          <div v-if="modalForm.problemSourceLevel === 3">街道</div>
          <div v-if="modalForm.problemSourceLevel === 4">社区</div>
          <div v-if="modalForm.problemSourceLevel === 5">网格</div>
        </FormItem>
        <FormItem label="事件类型：" >
          <div>{{registerInfo.eventType}}</div>
        </FormItem>
        <FormItem label="立案条件："  >
          <div>{{registerInfo.filingCondition}}</div>
        </FormItem>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal">取 消</Button>
          <Button type="primary" @click="handleCloseModal" style="margin-left: 20px"
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
    handleUpdateStatus,
    handleDelete
  } from "@/api/event/supervise";

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
        registerInfo: {
        }
      };
    },
    created() {
      this.getList();
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
      },
      /** 修改按钮操作 */
      handleView(row) {
        this.clearRules()
        this.formType = 2
        this.modalTitle = '详情'
        this.modalForm = { ...row }
        this.registerInfo = row.registerInfo
        this.modalForm.status = row.status.toString()
        this.showModal = true;
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const param ={
          ids: row.id
        };
        this.$modal.confirm('是否确认删除编号为"' + row.caseNo + '"的数据项?').then(function() {
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
              // handleAdd(param)
              //   .then((response) => {
              //     if (response.code === 200) {
              //       this.$Message.success('新增成功!')
              //       this.handleCloseModal()
              //       this.getList()
              //     } else {
              //       this.$Message.error(response.message)
              //     }
              //   })
              //   .catch((error) => {
              //     this.$Message.error('新增失败!')
              //     console.log(error)
              //   })
            } else {
              const param = {
                ...this.modalForm
              }
              // handleUpdate(param)
              //   .then((response) => {
              //     if (response.code === 200) {
              //       this.$Message.success('更新成功!')
              //       this.handleCloseModal()
              //       this.getList()
              //     } else {
              //       this.$Message.error(response.data.message)
              //     }
              //   })
              //   .catch((error) => {
              //     this.$Message.error('更新失败!')
              //     console.log(error)
              //   })
            }
          }
        })
      },
    }
  };
</script>
