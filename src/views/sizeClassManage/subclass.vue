<template>
  <div style="margin-top: 20px">
    <Row class="container">
      <Col :span="4" style="height: 100%; overflow-y: scroll">
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
            node-key="id"
            :expand-on-click-node="false"
            :current-node-key="selectId"
            default-expand-all
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
      </Col>
      <Col :span="20" style="height: 100%; overflow-y: scroll">
        <div>
          <Form
            ref="searchForm"
            :model="searchForm"
            :label-width="110"
            inline
            style="padding: 10px 0 0 0"
          >
            <FormItem label="小类名称：">
              <Input v-model="searchForm.smallName"  placeholder="请输入小类名称" autocomplete="off"></Input>
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
              <FormItem label="大类名称：" prop="parentId">
                <Select v-model="modalForm.parentId">
                  <Option
                    v-for="item in bigList"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem label="小类名称：" prop="name">
                <Input v-model="modalForm.name" placeholder="小类名称" />
              </FormItem>
<!--              <FormItem label="当前版本：" prop="version">-->
<!--                <Input-->
<!--                  v-model="modalForm.version"-->
<!--                  prop="name"-->
<!--                  placeholder="当前版本"-->
<!--                />-->
<!--              </FormItem>-->
              <FormItem label="当前状态：" prop="status">
                <RadioGroup v-model="modalForm.status">
                  <Radio label="0">开启</Radio>
                  <Radio label="1">关闭</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="">
                <Button type="default" @click="handleCloseModal">取 消</Button>
                <Button
                  type="primary"
                  @click="handleSubmit"
                  style="margin-left: 20px"
                  >确 定</Button
                >
              </FormItem>
            </Form>
          </Modal>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import dateFmt from "@/libs/dateFmt.js";
import {
  handleGetTreeList,
  handleDelRow,
  changeStatus,
  handleAdd,
  handleUpdate,
} from "@/api/sizeclass/large";
import { bigClassList, smallClassQuery } from "@/api/sizeclass/sub";
export default {
  name: "subclass",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    const bigid = this.$route.query && this.$route.query.bigid;
    this.selectId = bigid;
    if (bigid) {
      this.searchForm.bigid = bigid;
    }
    this.getTreeList();
    this.handleSearch();
    this.getBigList();
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.classLevel === "1") {
        this.searchForm.bigid = data.id;
        this.handleSearch();
      } else if (data.classLevel === "2") {
        this.$router.push({
          path: "/categoryConfig/sizeCLassManage/filingName",
          query: {
            bigId: data.parentId,
            smallId: data.id,
          },
        });
      }
      // else {
      //   this.$router.push({
      //     path: "/categoryConfig/sizeCLassManage/largeClassManage",
      //   });
      // }
    },
    getTreeList() {
      handleGetTreeList()
        .then((response) => {
          if (response.code == 200) {
            this.data = response.data;
          } else {
            this.$Message.error(response.msg);
          }
          this.$nextTick(function () {
            this.$refs.tree.setCurrentKey(this.selectId);
          });
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    getBigList() {
      bigClassList()
        .then((response) => {
          if (response.code === 200) {
            this.bigList = response.data;
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
      smallClassQuery(params)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.records || [];
            this.dataTotal = res.data.total || 0;
          } else {
            this.$Message.error({
              content: res.msg,
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
      this.$refs[name].resetFields();
      if (flag) {
        this.searchForm = {};
        this.search();
      }
    },
    add() {
      this.modalTitle = "新增";
      this.formType = 1;
      this.modalForm = {
        status: "0",
      };
      this.showModal = true;
    },
    handleDelRow(row) {
      handleDelRow(row.id)
        .then((response) => {
          if (response.code == 200) {
            this.$Message.success("删除成功！");
            this.handleSearch();
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("删除失败！");
        });
    },
    async handleEditRow(row) {
      this.clearRules();
      this.showModal = true;
      this.formType = 2;
      this.modalTitle = "编辑";
      this.modalForm = { ...row };
      this.modalForm.status = this.modalForm.status.toString();
    },
    async handleChangeStatus(row) {
      const param = {
        id: row.id,
        status: row.status === 1 ? 0 : 1,
      };
      changeStatus(param)
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
    clearRules() {
      this.$refs["refModalForm"].resetFields();
    },
    handleCloseModal() {
      this.reset("refModalForm");
      this.modalForm = {
        name: "",
        key: "",
      };
      this.showModal = false;
    },
    handleSubmit() {
      this.$refs["refModalForm"].validate((valid) => {
        if (valid) {
          this.modalForm.status = parseInt(this.modalForm.status);
          if (this.formType === 1) {
            const param = {
              ...this.modalForm,
              classLevel: 2,
            };
            handleAdd(param)
              .then((response) => {
                if (response.code === 200) {
                  this.$Message.success("新增成功!");
                  this.handleCloseModal();
                  this.search();
                  this.getTreeList();
                } else {
                  this.$Message.error(response.data.message);
                }
              })
              .catch((error) => {
                this.$Message.error("新增失败!");
                console.log(error);
              });
          } else {
            const param = {
              ...this.modalForm,
              classLevel: 2,
            };
            handleUpdate(param)
              .then((response) => {
                if (response.code === 200) {
                  this.$Message.success("更新成功!");
                  this.handleCloseModal();
                  this.search();
                  this.getTreeList();
                } else {
                  this.$Message.error(response.message);
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
  },

  data() {
    return {
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
      },
      selectId: null,
      columns: [
        // {
        //   title: "大类名称",
        //   align: "center",
        //   key: "bigClassName",
        // },
        {
          title: "小类名称",
          align: "center",
          key: "name",
        },
        // {
        //   title: "版本",
        //   align: "center",
        //   key: "version",
        //   width: "auto",
        // },
        {
          key: "updateTime",
          title: "更新时间",
          width: 200,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            if (params.row.updateTime) {
              return h(
                "div",
                dateFmt("YYYY-mm-dd HH:MM:SS", new Date(params.row.updateTime))
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#333",
                  },
                },
                "/"
              );
            }
          },
        },
        {
          key: "status",
          title: "状态",
          width: "auto",
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
          key: "updateName",
          title: "更新人",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "organizationName",
          title: "绑定部门",
          width: "auto",
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
        smallName: null,
        status: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: "小类名称不可为空",
            trigger: "blur",
            type: "string",
          },
        ],
        parentId: [
          {
            required: true,
            message: "大类不可为空",
            trigger: "blur",
            type: "number",
          },
        ],
        version: [
          {
            required: true,
            message: "版本不可为空",
            trigger: "blur",
            type: "string",
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
      bigList: [],
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  height: calc(~"100vh - 130px");
}
::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(243, 249, 254, 0.1);
  -webkit-box-shadow: none;
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0);
  -webkit-box-shadow: none;
}
</style>
