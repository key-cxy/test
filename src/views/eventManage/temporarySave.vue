<template>
  <div class="es-container">
    <!-- eventDetailVisible -->
    <my-dialog
      :title="'暂存详情 ' + ' （单号：' + caseNo + ')'"
      width="99.6%"
      :visible.sync="eventDetailVisible"
      :modal="false"
    >
      <temporary-detail
        @handleCloseTemDetal="handleCloseTemDetal"
        :caseNo="caseNo"
        :caseStatus="3"
        :rowId="rowId"
      ></temporary-detail>
    </my-dialog>

    <Form
      ref="searchForm"
      :model="searchForm"
      :label-width="110"
      inline
      style="padding: 10px 0 0 0"
    >
      <FormItem label="事件编号：">
        <Input
          v-model="searchForm.caseNo"
          prop="key"
          placeholder="请输入"
          style="width: 188px"
        />
      </FormItem>
      <FormItem label="事件来源：">
        <Select v-model="searchForm.problemSourceId" style="width: 188px">
          <Option
            v-for="item in problemOriginList"
            :value="item.id"
            :key="item.id"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="事件类型：">
        <Select v-model="searchForm.eventType" style="width: 188px">
          <Option
            v-for="item in questionTypeList"
            :value="item.label"
            :key="item.id"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="事件主题：">
        <Select v-model="searchForm.topic" style="width: 188px">
          <Option
            v-for="item in topicList"
            :value="item.label"
            :key="item.id"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="所属区域：">
        <el-cascader
          style="width: 188px"
          :options="departmentList"
          :props="optionProps"
          v-model="searchForm.deptId"
          :show-all-levels="false"
          @change="getCheckedNodes"
          clearable
        >
        </el-cascader>
      </FormItem>
      <FormItem label="所属网络：">
        <Select v-model="searchForm.select1" style="width: 188px">
          <Option value="beijing">暂无数据</Option>
        </Select>
      </FormItem>
      <FormItem label="处置部门：">
        <Select v-model="searchForm.select2" style="width: 188px">
          <Option value="beijing">暂无数据</Option>
        </Select>
      </FormItem>
      <FormItem label="所属大类：">
        <Select
          v-model="searchForm.largeId"
          style="width: 188px"
          @on-change="selectBigClass"
        >
          <Option v-for="item in bigList" :value="item.id" :key="item.id">{{
            item.label
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属小类：">
        <Select
          v-model="searchForm.smallId"
          style="width: 188px"
          @on-change="selectSmallClass"
        >
          <Option v-for="item in smallList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案名称：">
        <Select
          v-model="searchForm.filingId"
          style="width: 188px"
          @on-change="selectFilling"
        >
          <Option v-for="item in filingList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案条件：">
        <Select v-model="searchForm.filingCondition" style="width: 188px">
          <Option
            v-for="(item, index) in filingConditionList"
            :value="item"
            :key="index"
            >{{ item }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="考核单位：">
        <Select
          v-model="searchForm.assessmentUnits"
          multiline
          style="width: 188px"
        >
          <Option
            v-for="item in assessmentUnitsList"
            :value="item.id"
            :key="item.id"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="时间类型：">
        <Select v-model="searchForm.queryTimeType" style="width: 188px">
          <Option
            v-for="item in queryTimeTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="开始时间：">
        <DatePicker
          type="date"
          placeholder="请选择开始时间"
          v-model="searchForm.beginTime"
        ></DatePicker>
      </FormItem>
      <FormItem label="结束时间：">
        <DatePicker
          type="date"
          placeholder="请选择结束时间"
          v-model="searchForm.endTime"
        ></DatePicker>
      </FormItem>
      <FormItem label="上报人员：">
        <el-select v-model="searchForm.collector" filterable  style="width: 188px" placeholder="请先选择所属区域">
          <el-option v-for="item in userList" :value="item.id" :key="item.id" :label="item.nickname"></el-option>
        </el-select>
      </FormItem>

      <FormItem label>
        <Button @click="search" type="primary" icon="md-search">搜 索</Button>
        <Button
          @click="reset('searchForm', true)"
          type="default"
          icon="md-refresh"
          style="margin-left: 10px"
          >重 置
        </Button>
        <!-- <Button
          @click="toOutWeb"
          type="primary"
          style="margin-left: 10px"
          icon="md-search"
          >旧案卷</Button
        > -->
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
    <Row type="flex" justify="start" align="middle" style="padding: 20px 0">
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
      fullscreen
      title="流程图"
      footer-hide
      @on-cancel="handleCloseModal"
    >
      <div class="imgCode" v-html="imgCodeUrl"></div>
    </Modal>
  </div>
</template>

<script>
import dateFmt from "@/libs/dateFmt.js";
import {
  getTemporarySaveInfo,
  handleImage,
  getInforList,
  getInfor,
} from "@/api/event/search";
import getTree from "@/libs/tree.js";
import { getDeptTreeList } from "@/api/sizeclass/dept";
import { bigClassList } from "@/api/sizeclass/sub";
import { listSimpleUsers, getUserProfile,getUserListByDept } from "@/api/system/user";
import { getDictData, problemSourceList2 } from "@/api/eventAcceptance.js";

import temporaryDetail from "./temporaryDetail.vue";
import myDialog from "./cpns/my-dialog.vue";
export default {
  components: {
    temporaryDetail,
    myDialog,
  },
  data() {
    return {
      columns: [
        {
          key: "caseNo",
          title: "单号",
          align: "center",
          width: "auto",
          tooltip: true,
        },
        {
          key: "problemSourceName",
          title: "事件来源",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "eventType",
          title: "事件类型",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "topic",
          title: "事件主题",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "largeName",
          title: "所属大类",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "smallName",
          title: "所属小类",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "userName",
          title: "上报人员",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "handle",
          title: "操作",
          align: "center",
          width: "auto",
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
                      this.handlePush(params.row);
                    },
                  },
                },
                "暂存详情"
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
        returnVisit: null,
        inspect: null,
        timeOut: null,
        finishStatus: null,
        delay: null,
        checkFail: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: "模型名称不可为空",
            trigger: "blur",
            type: "string",
          },
        ],
        key: [
          {
            required: true,
            message: "模型名称不可为空",
            trigger: "blur",
            type: "string",
          },
        ],
      },
      showModal: false,
      imgCodeUrl: "",
      modalForm: {
        name: "",
      },
      // 1.新增 2.编辑 3.查看
      formType: 1,
      rowData: {},
      bigList: [],
      smallList: [],
      filingList: [],
      assessmentUnitsList: [],
      filingConditionList: [],
      queryTimeTypeList: [
        {
          value: 0,
          name: "事件受理时间",
        },
        {
          value: 1,
          name: "事件结束时间",
        },
        {
          value: 2,
          name: "二级平台开始时间",
        },
        {
          value: 3,
          name: "二级平台结束时间",
        },
      ],
      departmentList: [],
      optionProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true,
      },
      problemOriginList: [], //事件来源list
      questionTypeList: [],
      topicList: [],
      interestList: [],
      userList: [],
      eventDetailVisible: false,
      caseNo: "",
      rowId: null,
    };
  },
  mounted() {
    this.getDeptTreeList();
    this.getBigList();
    this.handleSearch();

    this.getDictData("interest"); // 兴趣点
    this.getDictData("question_type"); // 事件类型
    this.getDictData("topic"); //事件主题
    //  this.getAreaTree(); //获取所属区域
    this.problemSourceList(); // 获取事件来源
    // this.listSimpleUsers(); // 获取上报人
  },
  methods: {
    handleCloseTemDetal() {
      this.eventDetailVisible = false;
      this.handleSearch();
    },
    handleSearch() {
      this.tableLoading = true;
      const params = {
        ...this.searchForm,
        deptScope: 3,
        pageNo: this.currentPageNum,
        pageSize: this.pageSize,
      };
      if (params.deptId) {
        params.deptId =
          this.searchForm.deptId[this.searchForm.deptId.length - 1];
      }
      getTemporarySaveInfo(params)
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
          //   content: '获取数据失败!',
          //   duration: 2
          // })
        });
    },
    reset(name, flag) {
      this.$refs[name].resetFields();
      if (flag) {
        (this.searchForm = {
          returnVisit: null,
          inspect: null,
          timeOut: null,
          finishStatus: null,
          delay: null,
          checkFail: null,
        }),
          this.search();
      }
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
    handleCloseModal() {
      this.showModal = false;
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
    selectBigClass(value) {
      this.smallList = [];
      this.filingList = [];
      if (value) {
        const param = {
          parentId: value,
        };
        bigClassList(param)
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
      this.filingList = [];
      if (value) {
        const param = {
          parentId: value,
        };
        bigClassList(param)
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
    selectFilling(value) {
      this.assessmentUnitsList = [];
      this.filingConditionList = [];
      if (value) {
        const param = {
          filingId: value,
        };
        const param1 = {
          classId: value,
        };
        getInforList(param1)
          .then((response) => {
            if (response.code === 200) {
              this.assessmentUnitsList = response.data;
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("考核单位获取失败！");
          });
        getInfor(param)
          .then((response) => {
            if (response.code === 200) {
              this.filingConditionList = [response.data.filingCondition];
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("立案条件获取失败！");
          });
      }
    },
    getCheckedNodes(value) {
      console.log("value", value);
      const id = value[value.length - 1];
      const i = getTree(this.departmentList, id);
      this.searchForm.deptCode = i.code;
      this.listSimpleUsers(id)
    },
    getDeptTreeList() {
      getDeptTreeList().then((res) => {
        if (res.code == 200) {
          this.departmentList = this.deleteChildren([res.data]);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    deleteChildren(arr) {
      let childs = arr;
      for (let i = childs.length; i--; i > 0) {
        if (childs[i].children) {
          if (childs[i].children.length > 0) {
            this.deleteChildren(childs[i].children);
          } else {
            delete childs[i].children;
          }
        }
      }
      return arr;
    },
    // 字典表 事件类型，主题，兴趣点 question_type 事件类型 topic 事件主题 interest 兴趣点
    getDictData(type) {
      getDictData(type).then((res) => {
        if (res.code == 0) {
          if (type == "interest") {
            this.interestList = res.data;
          }
          if (type == "question_type") {
            this.questionTypeList = res.data;
          }
          if (type == "topic") {
            this.topicList = res.data;
          }
        }
      });
    },
    problemSourceList() {
      problemSourceList2().then((res) => {
        if (res.code == 200) {
          this.problemOriginList = res.data;
        }
      });
    },
    listSimpleUsers (id) {
      const param ={
        deptId : id
      }
      this.userList = []
      getUserListByDept(param).then((res) => {
        if (res.code == 0) {
          this.userList = res.data;
        }
      });
    },
    handlePush(row) {
      const param = {
        caseNo: row.caseNo,
      };
      console.log(row);
      this.caseNo = row.caseNo;
      this.rowId = row.id;
      this.eventDetailVisible = !this.eventDetailVisible;

      // this.$router.push({
      //   path: "/event/eventDetail",
      //   query: {
      //     caseNo: row.caseNo,
      //     caseStatus: 3,
      //   },
      // });
    },
    toOutWeb() {
      getUserProfile().then((response) => {
        const username = response.data.username;
        window.open(
          "https://cgj.jscz.org.cn/czslpt/historyLinkage?id=82b763a3858b783201858b7e06960003&username=" +
            username,
          "_blank"
        );
      });
    },
  },
};
</script>

<style scoped>
.es-container {
  width: 100% !important;
  /* height: 100% !important; */
}

.imgCode {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
}
</style>
