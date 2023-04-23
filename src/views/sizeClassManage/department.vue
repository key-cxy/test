<template>
  <div style="margin-top: 20px">
    <Row>
      <Col :span="4">
        <div
          style="
            width: 90%;
            margin-left: 5%;
            overflow-y: auto;
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
      <Col :span="4">
        <div
          style="
            width: 90%;
            height: 89vh;
            overflow-y: auto;
            background-color: #f8f8f9;
          "
        >
          <el-input
            prefix-icon="el-icon-search"
            style="margin-top: 10px; width: 90%; margin-left: 5%"
            placeholder="输入关键字进行过滤"
            v-model="filterTextTemp"
          >
          </el-input>

          <el-tree
            style="margin-top: 15px; background-color: #f8f8f9"
            class="filter-tree"
            :data="dataTemp"
            :props="defaultPropsTemp"
            :highlight-current="true"
            :expand-on-click-node="false"
            default-expand-all
            :filter-node-method="filterNodeTemp"
            @node-click="handleNodeClickTemp"
            ref="treeTemp"
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
      <Col :span="16">
        <div>
<!--          <Form-->
<!--            ref="searchForm"-->
<!--            :model="searchForm"-->
<!--            :label-width="110"-->
<!--            inline-->
<!--            style="padding: 10px 0 0 0"-->
<!--          >-->
<!--            <FormItem>-->
<!--              <Button @click="search" type="primary" icon="md-search"-->
<!--                >搜 索</Button-->
<!--              >-->
<!--              <Button-->
<!--                @click="reset('searchForm', true)"-->
<!--                type="default"-->
<!--                icon="md-refresh"-->
<!--                style="margin-left: 10px"-->
<!--                >重 置-->
<!--              </Button>-->
<!--            </FormItem>-->
<!--          </Form>-->
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
  </div>
</template>

<script>
import dateFmt from "@/libs/dateFmt.js";
import { getDeptTreeList, getClassTreeList } from "@/api/sizeclass/dept";
import { smallClassQuery } from "@/api/sizeclass/sub";
import {
  handleGetList,
  handleGetTreeList,
  classQuery,
} from "@/api/sizeclass/dept";

export default {
  name: "filingConditions",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTextTemp(val) {
      this.$refs.treeTemp.filter(val);
    },
  },
  mounted() {
    this.getBigList();
    this.getTreeList();
    this.handleSearch();
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    filterNodeTemp(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.getClassTreeList(data.id);
    },
    handleNodeClickTemp(data) {
      this.searchForm.classId = data.id;
      this.searchForm.classLevel = data.classLevel;
      this.handleSearch();
    },
    getTreeList() {
      getDeptTreeList()
        .then((response) => {
          if (response.code == 200) {
            this.data = [response.data];
            this.getClassTreeList(response.data.id);
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    getClassTreeList(id) {
      const param = {
        deptId: id,
      };
      getClassTreeList(param)
        .then((response) => {
          if (response.code == 200) {
            this.dataTemp = response.data;
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },
    getBigList() {
      handleGetList(1)
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
    selectBigClass(value) {
      if (value) {
        handleGetList(value)
          .then((response) => {
            if (response.code === 200) {
              this.smallList = response.data;
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("失败！");
          });
      }
    },
    selectSmallClass(value) {
      if (value) {
        handleGetList(value)
          .then((response) => {
            if (response.code === 200) {
              this.filingList = response.data;
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("失败！");
          });
      }
    },
    handleSearch() {
      this.tableLoading = true;
      const params = {
        ...this.searchForm,
        pageNo: this.currentPageNum,
        pageSize: this.pageSize,
      };
      classQuery(params)
        .then((res) => {
          if (res.code == 200) {
            if (this.searchForm.classLevel === "0") {
            } else if (this.searchForm.classLevel === "1") {
              this.columns = this.columns1;
            } else if (this.searchForm.classLevel === "2") {
              this.columns = this.columns2;
            } else if (this.searchForm.classLevel === "3") {
              this.columns = this.columns3;
            }
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
          //   content: '获取数据失败!',
          //   duration: 2
          // })
        });
    },
    reset(name, flag) {
      // this.$refs[name].resetFields();
      if (flag) {
        this.smalllist = [];
        this.filingList = [];
        this.searchForm = {
          classLevel: "0"
        };
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
  },

  data() {
    return {
      filterText: "",
      filterTextTemp: "",
      data: [],
      dataTemp: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultPropsTemp: {
        children: "children",
        label: "label",
      },
      bigShow: true,
      smallShow: true,
      nameShow: true,
      codeShow: true,
      columns: [
        {
          title: "大类名称",
          align: "center",
          key: "name",
        },
        // {
        //   title: "版本",
        //   align: "center",
        //   key: "version",
        //   width: 250,
        // },
        {
          key: "status",
          title: "状态",
          width: 350,
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
      ],
      columns1: [
        {
          title: "小类名称",
          align: "center",
          key: "name",
        },
        // {
        //   title: "版本",
        //   align: "center",
        //   key: "version",
        //   width: 100,
        // },
        {
          key: "status",
          title: "状态",
          width: 150,
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
      ],
      columns2: [
        {
          title: "立案名称",
          align: "center",
          key: "name",
        },
        // {
        //   title: "版本",
        //   align: "center",
        //   key: "version",
        //   width: 100,
        // },
        {
          key: "status",
          title: "状态",
          width: 150,
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
      ],
      columns3: [
        {
          title: "立案条件",
          align: "center",
          key: "filingCondition",
        },
        // {
        //   title: "版本",
        //   align: "center",
        //   key: "version",
        //   width: 100,
        // },
        {
          key: "status",
          title: "状态",
          width: 150,
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
      ],
      tableData: [],
      tableHeight: "auto",
      tableLoading: false,
      dataTotal: 0,
      pageSizeArr: [10, 20],
      pageSize: 10,
      currentPageNum: 1,
      searchForm: {
        classLevel: "0",
        name: null,
        key: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: "流程名称不可为空",
            trigger: "blur",
            type: "string",
          },
        ],
        key: [
          {
            required: true,
            message: "流程key不可为空",
            trigger: "blur",
            type: "string",
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
      smallList: [],
      filingList: [],
      typeList: [
        {
          id: 1,
          name: "工作日",
        },
        {
          id: 2,
          name: "紧急工作日",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
