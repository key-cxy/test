<template>
  <div style="margin-top: 20px">
    <Row>
      <Col :span="4">
        <div
          style="
            width: 90%;
            margin-left: 5%;
            height: 89vh;
            background-color: #f8f8f9;
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
            :data="data"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </Col>
      <Col :span="20">
        <div>
          <Form
            ref="searchForm"
            :model="searchForm"
            :label-width="110"
            inline
            style="padding: 10px 0 0 0"
          >
            <FormItem label="问题来源：">
              <Input
                v-model="searchForm.name"
                placeholder="请输入问题来源"
                autocomplete="off"
              ></Input>
            </FormItem>
            <FormItem label="添加时间：">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </FormItem>
            <FormItem label="状态：">
              <Select v-model="searchForm.status" style="width: 188px">
                <Option :value="1">关闭</Option>
                <Option :value="0">启用</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button @click="search" type="primary" icon="md-search"
              >搜 索</Button
              >
              <Button
                @click="reset('searchForm', true)"
                type="default"
                icon="md-refresh"
                style="margin-left: 10px"
              >重 置</Button
              >
              <Button
                @click="add"
                type="primary"
                icon="md-add"
                style="margin-left: 10px"
              >新增</Button
              >
            </FormItem>
          </Form>
          <Row>
            <Col span="24">
              <Table
                ref="table"
                :columns="columns"
                :data="tableData"
                :height="tableHeight"
                :loading="tableLoading"
              ></Table>
            </Col>
          </Row>
          <Row
            type="flex"
            justify="start"
            align="middle"
            style="padding: 20px 0 100px 0"
          >
            <Col span="24" style="text-align: center">
              <Page
                ref="page"
                show-total
                showSizer
                show-elevator
                :total="dataTotal"
                :current="currentPageNum"
                :page-size="pageSize"
                :page-size-opts="pageSizeArr"
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
              ></Page>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Modal
      v-model="showModal"
      :title="modalTitle"
      width="750"
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
          <Select v-model="modalForm.problemSourceId">
            <Option
              v-for="item in questionList"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="流程定义编号：" prop="processDefinitionId">
          <Select v-model="modalForm.processDefinitionId">
            <Option
              v-for="item in smallList"
              :value="item.procDefKey"
              :key="item.procDefKey"
            >{{ item.procDefName }}</Option
            >
          </Select>
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
  </div>
</template>

<script>
  import dateFmt from "@/libs/dateFmt.js";
  import { getDeptTreeList } from "@/api/sizeclass/large";
  import {
    handleList,
    handleSimpleList,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleUpdateStatus,
    handleProcDefKeyList,
  } from "@/api/question/bpm";
  import { getSimpleList } from "@/api/bpm/definition";
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    mounted() {
      this.getTreeList();
      this.handleSimpleList();
      this.getSimpleList(2);
      this.search();
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleNodeClick(data) {
        this.searchForm.deptId = data.id;
        this.handleSearch();
      },
      getTreeList() {
        getDeptTreeList()
          .then((response) => {
            if (response.code == 200) {
              this.data = [response.data];
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("失败！");
          });
      },
      handleSearch() {
        this.tableLoading = true;
        const params = {
          ...this.searchForm,
          pageNo: this.currentPageNum,
          pageSize: this.pageSize,
        };
        if (this.searchForm.dateRange) {
          params.beginCreateTime = this.searchForm.dateRange[0];
          params.endCreateTime = this.searchForm.dateRange[1];
        }
        this.tableData = [];
        this.dataTotal = 0;
        handleList(params)
          .then((res) => {
            if (res.code == 200) {
              this.tableData = res.data.records || [];
              this.dataTotal = res.data.total || 0;
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 2,
              });
            }
            this.tableLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.tableLoading = false;
            // this.$Message.error({
            //   content: "获取数据失败!",
            //   duration: 2
            // });
          });
      },
      reset(name, flag) {
        // this.$refs[name].resetFields();
        if (flag) {
          this.searchForm = {};
          this.search();
        }
      },
      clearRules() {
        this.$refs["refModalForm"].resetFields();
      },
      search() {
        this.currentPageNum = 1;
        this.pageSize = 10;
        this.handleSearch();
      },
      handlePageChange(pageNum) {
        this.currentPageNum = pageNum;
        this.handleSearch();
      },
      handlePageSizeChange(size) {
        this.currentPageNum = 1;
        this.pageSize = size;
        this.handleSearch();
      },
      add() {
        this.modalTitle = "新增";
        this.formType = 1;
        this.modalForm = {};
        this.modalForm.status = "0";
        this.showModal = true;
      },
      handleEditRow(row) {
        this.clearRules();
        this.getSimpleList(2);
        this.formType = 2;
        this.checkList = [];
        this.modalTitle = "编辑";
        this.modalForm = { ...row };
        this.modalForm.status = this.modalForm.status.toString();
        this.showModal = true;
      },
      handleCloseModal() {
        this.reset("refModalForm");
        this.showModal = false;
      },
      handleSubmit() {
        this.$refs["refModalForm"].validate((valid) => {
          if (valid) {
            if (this.formType === 1) {
              this.modalForm.status = parseInt(this.modalForm.status);
              const param = {
                ...this.modalForm,
              };
              handleAdd(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success("新增成功!");
                    this.handleCloseModal();
                    this.search();
                    this.getTreeList();
                  } else {
                    this.$Message.error(response.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error("新增失败!");
                  console.log(error);
                });
            } else {
              this.modalForm.status = parseInt(this.modalForm.status);
              const param = {
                ...this.modalForm,
              };
              handleUpdate(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success("更新成功!");
                    this.handleCloseModal();
                    this.search();
                    this.getTreeList();
                  } else {
                    this.$Message.error(response.data.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error("更新失败!");
                  console.log(error);
                });
            }
          }
        });
      },
      handleDelRow(row) {
        const param = {
          ids: row.id,
        };
        handleDelete(param)
          .then((response) => {
            if (response.code == 200) {
              this.$Message.success("删除成功！");
              this.handleSearch();
            } else {
              this.$Message.error(response.data.msg);
            }
          })
          .catch(() => {
            this.$Message.error("删除失败！");
          });
      },
      handleChangeStatus(row) {
        const param = {
          ids: row.id,
          status: row.status === 1 ? 0 : 1,
        };
        handleUpdateStatus(param)
          .then((response) => {
            if (response.code == 200) {
              this.$Message.success(response.msg);
              this.handleSearch();
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("修改状态失败！");
          });
      },
      handleSimpleList() {
        handleSimpleList().then((response) => {
          this.questionList = response.data;
        });
      },
      getSimpleList(value) {
        const param = {
          scope: value,
        };
        handleProcDefKeyList(param).then((response) => {
          this.smallList = response.data;
        });
      },
    },

    data() {
      return {
        filterText: "",
        data: [],
        defaultProps: {
          children: "children",
          label: "name",
        },
        columns: [
          {
            title: "问题来源",
            align: "center",
            key: "problemSourceName",
            width: 150,
          },
          {
            title: "更新人",
            align: "center",
            key: "updater",
          },
          {
            title: "添加时间",
            align: "center",
            key: "createTime",
            width: 200,
            render: (h, params) => {
              if (params.row.createTime) {
                return h(
                  "div",
                  dateFmt("YYYY-mm-dd HH:MM:SS", new Date(params.row.createTime))
                );
              }
            },
          },
          {
            key: "status",
            title: "状态",
            width: 200,
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let deviceStatus = "";
              if (params.row.status === 0) {
                deviceStatus = "启用";
              } else {
                deviceStatus = "关闭";
              }
              return h("div", [
                h("i-switch", {
                  //数据库1是已处理，0是未处理
                  props: {
                    type: "primary",
                    value: params.row.status === 0, //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    "on-change": (value) => {
                      //触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      this.handleChangeStatus(params.row); //params.index是拿到table的行序列，可以取到对应的表格值
                    },
                  },
                }),
                h(
                  "span",
                  {
                    style: {
                      marginLeft: "5px",
                    },
                  },
                  deviceStatus
                ),
              ]);
            },
          },
          {
            key: "processDefinitionName",
            title: "绑定流程实例",
            align: "center",
            tooltip: true,
          },
          {
            key: "handle",
            title: "操作",
            align: "center",
            width: 200,
            fixed: "right",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                    },
                    style: {
                      margin: "0 5px",
                    },
                    on: {
                      click: () => {
                        this.handleEditRow(params.row);
                      },
                    },
                  },
                  "编辑"
                ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除该条数据？",
                      transfer: true,
                    },

                    on: {
                      "on-ok": () => {
                        this.handleDelRow(params.row);
                      },
                    },
                  },
                  [
                    h(
                      "Button",
                      {
                        style: {
                          margin: "0 5px",
                        },
                        props: {
                          type: "error",
                          size: "small",
                          placement: "top",
                        },
                      },
                      "删除"
                    ),
                  ]
                ),
              ]);
            },
          },
        ],
        tableData: [],
        tableHeight: "auto",
        tableLoading: false,
        dataTotal: 0,
        pageSizeArr: [10, 20],
        pageSize: 10,
        currentPageNum: 1,
        searchForm: {
          name: null,
          key: null,
        },
        rules: {
          problemSourceId: [
            {
              required: true,
              message: "问题来源不可为空",
              trigger: "change",
              type: "number",
            },
          ],
          processDefinitionId: [
            {
              required: true,
              message: "流程实例不可为空",
              trigger: "change",
            },
          ],
          status: [
            {
              required: true,
              type: "string",
              message: "状态不能为空",
              trigger: "change",
            },
          ],
        },
        showModal: false,
        modalTitle: "",
        modalForm: {
          name: "",
        },
        // 1.新增 2.编辑 3.查看
        formType: 1,
        rowData: {},
        questionList: [],
        smallList: [],
        checkList: [],
      };
    },
  };
</script>

<style scoped>
  /deep/ .el-table .cell {
    white-space: pre-line;
  }
</style>
