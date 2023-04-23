<template>
  <div class="es-container">
    <!-- eventDetailVisible -->
    <my-dialog :title="title" width="99.6%" :visible.sync="eventDetailVisible" :modal="false">
      <event-detail1 :caseNo="caseNo" :caseStatus="3"></event-detail1>
    </my-dialog>

    <Form ref="searchForm" :model="searchForm" :label-width="110" inline style="padding: 10px 0 0 0">
      <FormItem label="事件编号：">
        <Input v-model="searchForm.caseNo" prop="key" placeholder="请输入" style="width: 188px" />
      </FormItem>
      <FormItem label="事件来源：">
        <Select v-model="searchForm.problemSourceId" style="width: 188px">
          <Option v-for="item in problemOriginList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="事件类型：">
        <Select v-model="searchForm.eventType" style="width: 188px">
          <Option v-for="item in questionTypeList" :value="item.label" :key="item.id">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="事件主题：">
        <Select v-model="searchForm.topic" style="width: 188px">
          <Option v-for="item in topicList" :value="item.label" :key="item.id">{{
            item.label
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属区域：">
        <el-cascader style="width: 188px" :options="departmentList" :props="optionProps" v-model="searchForm.deptId"
          :show-all-levels="false" @change="getCheckedNodes" clearable>
        </el-cascader>
      </FormItem>
      <FormItem label="所属网格：">
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
        <Select v-model="searchForm.largeId" style="width: 188px" @on-change="selectBigClass">
          <Option v-for="item in bigList" :value="item.id" :key="item.id">{{
            item.label
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属小类：">
        <Select v-model="searchForm.smallId" style="width: 188px" @on-change="selectSmallClass">
          <Option v-for="item in smallList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案名称：">
        <Select v-model="searchForm.filingId" style="width: 188px" @on-change="selectFilling">
          <Option v-for="item in filingList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案条件：">
        <Select v-model="searchForm.filingCondition" style="width: 188px">
          <Option v-for="(item, index) in filingConditionList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="考核单位：">
<!--        <Select v-model="searchForm.assessmentUnits" multiline style="width: 188px">-->
<!--          <Option v-for="item in assessmentUnitsList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
<!--        </Select>-->
        <el-cascader
          style="width: 100%"
          placeholder="请选择考核单位"
          v-model="searchForm.assessmentUnitList"
          :options="assessmentUnitsList"
          @change="handleAssessmentUnit"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'id', label: 'name' }"
          clearable
        ></el-cascader>
      </FormItem>
      <FormItem label="时间类型：">
        <Select v-model="searchForm.queryTimeType" style="width: 188px">
          <Option v-for="item in queryTimeTypeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="开始时间：">
        <DatePicker type="date" placeholder="请选择开始时间" v-model="searchForm.beginTime"></DatePicker>
      </FormItem>
      <FormItem label="结束时间：">
        <DatePicker type="date" placeholder="请选择结束时间" v-model="searchForm.endTime"></DatePicker>
      </FormItem>
      <FormItem label="上报人员：">
        <el-select v-model="searchForm.collector" filterable  style="width: 188px" placeholder="请先选择所属区域">
          <el-option v-for="(item,index) in userList" :value="item.id" :key="index" :label="item.nickname"></el-option>
        </el-select>
      </FormItem>
      <FormItem label="是否回访：">
        <RadioGroup v-model="searchForm.returnVisit">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">已回访</Radio>
          <Radio :label="0">未回访</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否核查：">
        <RadioGroup v-model="searchForm.inspect">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">已核查</Radio>
          <Radio :label="0">未核查</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否超时：">
        <RadioGroup v-model="searchForm.timeOut">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">已超时</Radio>
          <Radio :label="0">未超时</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否办结：">
        <RadioGroup v-model="searchForm.finishStatus">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">已办结</Radio>
          <Radio :label="0">未办结</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否延期：">
        <RadioGroup v-model="searchForm.delay">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">已延期</Radio>
          <Radio :label="0">未延期</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="核查通过：">
        <RadioGroup v-model="searchForm.checkFail">
          <Radio :label="null">全部</Radio>
          <Radio :label="1">通过</Radio>
          <Radio :label="0">驳回</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label>
        <Button @click="search" type="primary" icon="md-search">搜 索</Button>
        <Button @click="reset('searchForm', true)" type="default" icon="md-refresh" style="margin-left: 10px">重 置
        </Button>
        <Button @click="toOutWeb" type="primary" style="margin-left: 10px" icon="md-search">旧案卷</Button>
      </FormItem>
    </Form>
    <Row>
      <Col span="24">
      <Table ref="table" :columns="columns" :data="tableData" :height="tableHeight" :loading="tableLoading"></Table>
      </Col>
    </Row>
    <Row type="flex" justify="start" align="middle" style="padding: 20px 0">
      <Col span="24" style="text-align: center">
      <Page ref="page" show-total showSizer show-elevator :total="dataTotal" :current="currentPageNum"
        :page-size="pageSize" :page-size-opts="pageSizeArr" @on-change="handlePageChange"
        @on-page-size-change="handlePageSizeChange"></Page>
      </Col>
    </Row>

    <Modal v-model="showModal" fullscreen title="流程图" footer-hide @on-cancel="handleCloseModal">
      <div class="imgCode" v-html="imgCodeUrl"></div>
    </Modal>
  </div>
</template>

<script>
import dateFmt from "@/libs/dateFmt.js";
import {
  handleList,
  handleImage,
  getInforList,
  getAssessmentUnit,
  getInfor,
} from "@/api/event/search";
import getTree from "@/libs/tree.js";
import { getDeptTreeList } from "@/api/sizeclass/dept";
import { bigClassList } from "@/api/sizeclass/sub";
import { listSimpleUsers, getUserProfile,getUserListByDept } from "@/api/system/user";
import { handleSupervise } from "@/api/event/supervise";
import { getDictData, problemSourceList2 } from "@/api/eventAcceptance.js";

import EventDetail1 from "./eventDetail1";
import Cookies from "js-cookie";

import myDialog from "./cpns/my-dialog.vue";
export default {
  components: {
    EventDetail1,
    myDialog,
  },
  data () {
    return {
      columns: [
        {
          title: "单号",
          align: "center",
          width: 250,
          key: "eventTaskInfo",
          render: (h, params) => {
            return h("span", params.row.eventTaskInfo.caseNo);
          },
        },
        {
          key: "problemSourceName",
          title: "事件来源",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "eventTaskInfo",
          title: "事件状态",
          width: "auto",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let status = "";
            if (params.row.eventTaskInfo.status === 0) {
              status = "进行中";
            } else if (params.row.eventTaskInfo.status === 1) {
              status = "已办结";
            }
            return h(
              "span",
              {
                style: { color: status === "进行中" ? "#00afff" : "#008F4A" },
              },
              status
            );
          },
        },
        {
          key: "shEndTime",
          title: "应该截至时间",
          width: "auto",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              dateFmt(
                "YYYY-mm-dd HH:MM:SS",
                params.row.eventTaskInfo.shEndTime? new Date(params.row.eventTaskInfo.shEndTime) : ''
              )
            );
          },
        },
        {
          key: "gbShEndTime",
          title: "国标结束时间",
          width: "auto",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              { style: { color: "#008F4A" } },
              dateFmt(
                "YYYY-mm-dd HH:MM:SS",
                params.row.eventTaskInfo.gbShEndTime? new Date(params.row.eventTaskInfo.gbShEndTime): ''
              )
            );
          },
        },
        {
          key: "endTime",
          title: "实际截止时间",
          width: "auto",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            if (params.row.eventTaskInfo.endTime) {
              return h(
                "div",
                { style: { color: "#008F4A" } },
                dateFmt(
                  "YYYY-mm-dd HH:MM:SS",
                  new Date(params.row.eventTaskInfo.endTime)
                )
              );
            } else {
              return h(
                "div",
                { style: { color: "rgba(245, 154, 35, 0.6980392156862745)" } },
                "进行中"
              );
            }
          },
        },
        {
          key: "assessmentUnitName",
          title: "处置单位/考核单位",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "collectorUserName",
          title: "采集人员",
          width: 100,
          align: "center",
          tooltip: true,
        },
        {
          key: "handle",
          title: "操作",
          align: "center",
          width: 300,
          render: (h, params) => {
            let temp = "";
            let type = "";
            if (params.row.superviseStatus === 0) {
              temp = "已督办";
              type = "";
            } else {
              temp = "督办";
              type = "primary";
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: type,
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.handleSupervise(params.row);
                    },
                  },
                },
                temp
              ),
              h(
                "Button",
                {
                  props: {
                    type: type,
                    size: "small",
                  },
                  style: {
                    margin: "0 5px",
                  },
                  on: {
                    click: () => {
                      //  this.handleSupervise(params.row);
                      this.handlePush(params.row);
                    },
                  },
                },
                "事件详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    margin: "0 5px",
                  },
                  on: {
                    click: () => {
                      this.handleViewRow(params.row);
                    },
                  },
                },
                "流程图"
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
        problemSourceId:null,
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
      title: "",
    };
  },
  mounted () {
    this.getDeptTreeList();
    this.getBigList();
    this.handleSearch();
    this.getAssessmentUnit();

    this.getDictData("interest"); // 兴趣点
    this.getDictData("question_type"); // 事件类型
    this.getDictData("topic"); //事件主题
    //  this.getAreaTree(); //获取所属区域
    this.problemSourceList(); // 获取事件来源
    // this.listSimpleUsers(); // 获取上报人
  },
  watch:{
    'searchForm.deptId':{
      handler(){
        // console.log(123,this.searchForm.deptId)
        if(this.searchForm.deptId.length == 0){
          console.log(321)
          this.searchForm.collector = ''
          this.userList = []
        }
      }
    }
  },
  methods: {
    handleSearch () {
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
      handleList(params)
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
    reset (name, flag) {
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
          this.userList = []
          this.search();
      }
    },
    search () {
      this.currentPageNum = 1;
      this.pageSize = 10;
      this.handleSearch();
    },
    handlePageChange (pageNum) {
      this.currentPageNum = pageNum;
      this.handleSearch();
    },
    handlePageSizeChange (size) {
      this.currentPageNum = 1;
      this.pageSize = size;
      this.handleSearch();
    },
    handleViewRow (row) {
      const param = {
        processInstanceId: row.eventTaskInfo.procInstId,
      };
      handleImage(param).then((res) => {
        this.imgCodeUrl = res;
        this.showModal = true;
      });
    },
    handleSupervise (row) {
      if (row.superviseStatus === 0) {
        this.$Message.error("该事件已督办！");
      } else {
        const param = {
          caseNo: row.caseNo,
        };
        handleSupervise(param)
          .then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("督办成功");
              this.handleSearch();
            }
          })
          .catch(() => {
            this.$Message.error("督办失败！");
          });
      }
    },
    handleCloseModal () {
      this.showModal = false;
    },
    getBigList () {
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
    selectBigClass (value) {
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
    selectSmallClass (value) {
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
    handleAssessmentUnit(value) {
      console.log(value);
      this.searchForm.assessmentUnits = [value[value.length - 1]];
    },
    getAssessmentUnit() {
      getAssessmentUnit().then((res) => {
        if (res.code === 200) {
          this.assessmentUnitsList = this.filterData(res.data);
        }
      });
    },
    filterData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          if (arr[i].children.length > 0) {
            this.filterData(arr[i].children);
          } else {
            delete arr[i].children;
          }
        }
      }
      return arr;
    },
    selectFilling (value) {
      this.assessmentUnitsList = [];
      this.filingConditionList = [];
      if (value) {
        const param = {
          filingId: value,
        };
        // const param1 = {
        //   classId: value,
        // };
        // getInforList(param1)
        //   .then((response) => {
        //     if (response.code === 200) {
        //       this.assessmentUnitsList = response.data;
        //     } else {
        //       this.$Message.error(response.msg);
        //     }
        //   })
        //   .catch(() => {
        //     this.$Message.error("考核单位获取失败！");
        //   });
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
    getCheckedNodes (value) {
      console.log("value", value);
      const id = value[value.length - 1];
      const i = getTree(this.departmentList, id);
      this.searchForm.deptCode = i.code;
      if(id){
        this.listSimpleUsers(id)
      }
    },
    getDeptTreeList () {
      getDeptTreeList().then((res) => {
        if (res.code == 200) {
          this.departmentList = this.deleteChildren([res.data]);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    deleteChildren (arr) {
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
    getDictData (type) {
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
    problemSourceList () {
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
    handlePush (row) {
      const param = {
        caseNo: row.caseNo,
      };
      this.caseNo = row.caseNo;
      this.eventDetailVisible = !this.eventDetailVisible;
      this.title = '事件详情：'+ this.caseNo
      // this.$router.push({
      //   path: "/event/eventDetail",
      //   query: {
      //     caseNo: row.caseNo,
      //     caseStatus: 3,
      //   },
      // });
    },
    toOutWeb () {
      getUserProfile().then((response) => {
        const username = response.data.username;
        window.open(
          "https://cgj.jscz.org.cn/czslpt/historyLinkage?id=4028010a86171ebf0186258328cf46dc&username=" +
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
