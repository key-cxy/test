<template>
  <div>
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
      <FormItem label="客户姓名：">
        <Input
          v-model="searchForm.userName"
          prop="key"
          placeholder="请输入"
          style="width: 188px"
        />
      </FormItem>
      <FormItem label="事件主题：">
        <Select v-model="searchForm.topic" style="width: 188px">
          <Option v-for="item in topicList" :value="item.id" :key="item.id">{{
            item.name
          }}</Option>
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
        <Select v-model="searchForm.select" style="width: 188px">
          <Option value="beijing">test</Option>
        </Select>
      </FormItem>
      <FormItem label="问题：">
        <Input
          v-model="searchForm.question"
          prop="key"
          placeholder="请输入问题"
          style="width: 388px"
        />
      </FormItem>
      <FormItem label="回答：">
        <Input
          v-model="searchForm.answer"
          prop="key"
          placeholder="请输入回答"
          style="width: 388px"
        />
      </FormItem>
      <FormItem label>
        <Button @click="search" type="primary" icon="md-search">搜 索</Button>
        <Button
          @click="reset('searchForm', true)"
          type="default"
          icon="md-refresh"
          style="margin-left: 10px"
          >重 置</Button
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
  </div>
</template>

<script>
import { getDictData } from "@/api/eventAcceptance.js";
import {
  handleConsultingList,
  handleImage,
  getInforList,
} from "@/api/event/search";
export default {
  data() {
    return {
      columns: [
        {
          title: "单号",
          align: "center",
          width: 250,
          key: "caseNo",
        },
        {
          key: "topic",
          title: "主题",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "userName",
          title: "客户姓名",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "purpose",
          title: "咨询目的",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "question",
          title: "问题描述",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "collectorUserName",
          title: "采集人员",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "answer",
          title: "解答",
          width: "auto",
          align: "center",
          tooltip: true,
        },
        {
          key: "handle",
          title: "操作",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: "/event/eventDetail",
                        query: {
                          caseNo: params.row.caseNo,
                        },
                      });
                    },
                  },
                },
                "操作"
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
      modalTitle: "",
      modalForm: {
        name: "",
      },
      // 1.新增 2.编辑 3.查看
      formType: 1,
      rowData: {},
      interestList: [],
      questionTypeList: [],
      topicList: [],
    };
  },
  created() {
    this.getDictData("question_type"); // 事件类型
    this.getDictData("topic"); //事件主题
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.tableLoading = true;
      const params = {
        ...this.searchForm,
        pageNo: this.currentPageNum,
        pageSize: this.pageSize,
      };
      handleConsultingList(params)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.list || [];
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
        });
    },
    reset(name, flag) {
      this.$refs[name].resetFields();
      if (flag) {
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
  },
};
</script>

<style scoped></style>
