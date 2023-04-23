<template>
  <div>
    <Form
      ref="searchForm"
      :model="searchForm"
      :label-width="110"
      inline
      style="padding: 10px 0 0 0"
    >
      <FormItem label="">
        <RadioGroup v-model="caseStatus" type="button" @on-change="change">
          <Radio :label="1">待认领</Radio>
          <Radio :label="2">进行中</Radio>
          <Radio :label="3">已办理</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="批量操作">
        <Select v-model="searchForm.select">
          <Option value="beijing">批量核查</Option>
          <Option value="shanghai">批量办结</Option>
        </Select>
      </FormItem>
      <FormItem label="列表自动刷新">
        <i-switch v-model="searchForm.switch" size="large">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </FormItem>
      <FormItem label="">
        <Button
          @click="openSearch"
          style="margin-left: 10px"
          type="primary"
          icon="md-search"
        >高级搜索</Button
        >
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
<!--        <Button type="primary" style="margin-left: 10px" icon="md-search" @click="test">交 班</Button>-->
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
      title="高级搜索"
      footer-hide
      @on-cancel="handleCloseModal"
    >
      <Form
        ref="refModalForm"
        :model="searchForm"
        :rules="rules"
        :label-width="130"
      >
        <FormItem label="事件编号：">
          <Input v-model="searchForm.caseNo" placeholder="事件编号" />
        </FormItem>
        <FormItem label="时间范围：">
          <DatePicker
            type="daterange"
            v-model="searchForm.daterange"
            placement="bottom-end"
            placeholder="时间范围"
          ></DatePicker>
        </FormItem>
        <FormItem label="大类名称：">
          <Select v-model="searchForm.bigId" @on-change="selectBigClass">
            <Option v-for="item in bigList" :value="item.id" :key="item.id">{{
              item.label
              }}</Option>
          </Select>
        </FormItem>
        <FormItem label="小类名称：">
          <Select v-model="searchForm.smallId" @on-change="selectSmallClass">
            <Option v-for="item in smallList" :value="item.id" :key="item.id">{{
              item.name
              }}</Option>
          </Select>
        </FormItem>
        <FormItem label="立案名称：">
          <Select v-model="searchForm.fillingId">
            <Option v-for="item in filingList" :value="item.id" :key="item.id">{{
              item.name
              }}</Option>
          </Select>
        </FormItem>
        <FormItem label="立案条件：">
          <Input v-model="searchForm.filingCondition" placeholder="立案条件" />
        </FormItem>
        <FormItem label="所属区域：">
          <el-cascader
            :options="departmentList"
            :props="optionProps"
            v-model="searchForm.deptId"
            :show-all-levels="false"
            @change="getCheckedNodes"
            clearable
          >
          </el-cascader>
        </FormItem>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal">取 消</Button>
          <Button type="primary" @click="search" style="margin-left: 20px"
          >确 定
          </Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import dateFmt from '@/libs/dateFmt.js'
  import {handleList} from "@/api/event/aduit"
  import getTree from "@/libs/tree.js";
  import { getDeptTreeList } from "@/api/sizeclass/dept";
  import { bigClassList } from "@/api/sizeclass/sub";
  import {
    handleClaimTask,
  } from "@/api/event/disposal";
  import moment from 'moment'
  export default {
    props: {
      name: String,
    },
    mounted() {
      this.handleSearch()
    },
    data(){
      return {
        columns: [
          {
            title: "单号",
            align: "center",
            key: "caseNo",
            render: (h, params) => {
              let no = params.row.eventTaskInfo.caseNo;
              return h("div", no);
            },
          },
          {
            key: "problemSourceName",
            title: "事件来源",
            width: "auto",
            align: "center",
            tooltip: true
          },
          {
            key: "startTime",
            title: "事件开始时间",
            width: "auto",
            align: "center",
            tooltip: true,
            render: (h, params) => {
              return h(
                'div',
                dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.eventTaskInfo.startTime))
              )
            }
          },
          {
            key: "shEndTime",
            title: "应该截至时间",
            width: "auto",
            align: "center",
            tooltip: true,
            render: (h, params) => {
              return h(
                'div',
                dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.eventTaskInfo.shEndTime))
              )
            }
          },
          {
            key: "operateType",
            title: "申请操作",
            width: "auto",
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let no = '';
              if (params.row.errorApply.operateType === 'yanqi'){
                no = '延期'
              } else if (params.row.errorApply.operateType === 'tuihui') {
                no = '返回'
              } else if (params.row.errorApply.operateType === 'guazhang') {
                no = '挂账'
              } else if (params.row.errorApply.operateType === 'chexiaobanjie') {
                no = '撤销办结'
              }
              return h("div", no);
            },
          },
          {
            key: "eventNode",
            title: "申请节点",
            width: "auto",
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let no = params.row.errorApply.eventNode;
              return h("div", no);
            },
          },
          {
            key: "reason",
            title: "申请理由",
            width: "auto",
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let no = params.row.errorApply.reason;
              return h("div", no);
            },
          },
          {
            key: "handle",
            title: "操作",
            align: "center",
            width: 200,
            render: (h, params) => {
              var status = true;
              if (this.caseStatus == 2) {
                status = true;
              } else if (this.caseStatus == 1) {
                status = false;
              }
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/event/eventDetailForAduit",
                          query: {
                            caseNo: params.row.eventTaskInfo.caseNo,
                            handleId: params.row.errorApply.id,
                            aduitType:false
                          },
                        });
                      }
                    }
                  },
                  "事件详情"
                ),
                status ?
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      margin: '0 5px'
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/event/eventDetailForAduit",
                          query: {
                            id: params.row.errorApply.subProcInstId,
                            handleId: params.row.errorApply.id,
                            caseNo: params.row.eventTaskInfo.caseNo,
                            aduitType: true
                          },
                        });
                      }
                    }
                  },
                  '批转'
                ) :
                  h(
                    'Button',
                    {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      style: {
                        margin: '0 5px'
                      },
                      on: {
                        click: () => {
                          this.handleEditRow(params.row);
                        },
                      }
                    },
                    '认领'
                  )
              ]);
            }
          }
        ],
        tableData: [],
        tableHeight: "auto",
        tableLoading: false,
        dataTotal: 0,
        pageSizeArr: [10, 20],
        pageSize: 10,
        currentPageNum: 1,
        caseStatus:1,
        searchForm: {
          caseStatus: '1',
        },
        rules: {
          name: [
            {
              required: true,
              message: "模型名称不可为空",
              trigger: "blur",
              type: "string"
            }
          ],
          key:[
            {
              required: true,
              message: "模型名称不可为空",
              trigger: "blur",
              type: "string"
            }
          ],
        },
        showModal: false,
        modalTitle: "",
        modalForm: {
          name: ""
        },
        // 1.新增 2.编辑 3.查看
        formType: 1,
        rowData: {},
        departmentList: [],
        optionProps: {
          value: "id",
          label: "name",
          children: "children",
          checkStrictly: true,
        },
        bigList: [],
        smallList: [],
        filingList: [],
      };
    },
    methods: {
      handleSearch() {
        this.tableLoading = true;
        if (this.searchForm.deptId) {
          this.searchForm.deptId =
            this.searchForm.deptId[this.searchForm.deptId.length - 1];
        }
        // if(this.searchForm.daterange.length &&this.searchForm.daterange.length >0) {
        //   this.searchForm.beginCreateTime = moment(this.searchForm.daterange[0]) || null
        //   this.searchForm.endCreateTime = moment(this.searchForm.daterange[1]) || null
        // }
        const params = {
          ...this.searchForm,
          caseStatus: this.caseStatus,
          operateType: this.name,
          pageNo: this.currentPageNum,
          pageSize: this.pageSize
        }
        handleList(params)
          .then(res => {
            if (res.code == 200) {
              this.tableData = res.data.list || [];
              this.dataTotal = res.data.total || 0;
              this.handleCloseModal();
            } else {
              this.$Message.error({
                content: res.msg,
                duration: 2
              });
            }
            this.tableLoading = false;
          })
          .catch(error => {
            console.log(error);
            this.tableLoading = false;
          });
      },
      reset(name, flag) {
        this.searchForm = {
          caseStatus: '1'
        }
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
      change(value){
        this.search()
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
        this.reset("refModalForm");
        this.smallList = [];
        this.filingList = [];
        this.showModal = false;
      },
      openSearch() {
        this.getDeptTreeList();
        this.getBigList();
        this.showModal = true;
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
      getCheckedNodes(value) {
        const id = value[value.length - 1];
        const i = getTree(this.departmentList, id);
        this.searchForm.deptCode = i.code;
      },
      handleEditRow(row) {
        const param = {
          taskId: row.id,
          operateType: row.errorApply.operateType
        };
        handleClaimTask(param)
          .then((response) => {
            if (response.code === 200) {
              this.$Message.success("认领成功!");
              this.search();
            } else {
              this.$Message.error(response.data.message);
            }
          })
          .catch((error) => {
            this.$Message.error("认领失败!");
            console.log(error);
          });
      },
    }

  }
</script>

<style scoped>

</style>
