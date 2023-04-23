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
      <FormItem label="事件来源：">
        <Select v-model="searchForm.problemSource" style="width: 188px">
          <Option v-for="item in problemOriginList" :value="item.code" :key="item.code">{{ item.text }}</Option>
        </Select>
      </FormItem>
      <FormItem label="事件类型：">
        <Select v-model="searchForm.eventType" style="width: 188px">
          <Option v-for="item in questionTypeList" :value="item.id" :key="item.id">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="事件主题：">
        <Select v-model="searchForm.topic" style="width: 188px">
          <Option v-for="item in topicList" :value="item.id" :key="item.id">{{ item.label }}</Option>
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
        <Select v-model="searchForm.large" style="width: 188px" @on-change="selectBigClass">
          <Option v-for="item in bigList" :value="item.id" :key="item.id">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属小类：">
        <Select v-model="searchForm.small" style="width: 188px" @on-change="selectSmallClass">
          <Option v-for="item in smallList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案名称：">
        <Select v-model="searchForm.filing" style="width: 188px" @on-change="selectFilling">
          <Option v-for="item in filingList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案条件：">
        <Select v-model="searchForm.filingCondition" style="width: 188px">
          <Option v-for="(item,index) in filingConditionList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="考核单位：">
        <Select v-model="searchForm.assessmentUnits" multiline style="width: 188px">
          <Option v-for="item in assessmentUnitsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
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
        <Select v-model="searchForm.collector" style="width: 188px">
          <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
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
        <Button
          @click="reset('searchForm', true)"
          type="default"
          icon="md-refresh"
          style="margin-left: 10px"
        >重 置
        </Button
        >
        <!--        <Button @click="exportExcel" type="primary" style="margin-left: 10px" icon="md-search">导 出</Button>-->
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
      <div v-html="imgCodeUrl"></div>
    </Modal>
  </div>
</template>

<script>
  import dateFmt from '@/libs/dateFmt.js'
  import { handleList, handleImage, getInforList, getInfor } from '@/api/event/search'
  import getTree from '@/libs/tree.js'
  import { getDeptTreeList } from '@/api/sizeclass/dept'
  import { bigClassList } from '@/api/sizeclass/sub'
  import { listSimpleUsers } from '@/api/system/user'
  import { handleSupervise } from '@/api/event/supervise'
  import {
    getDictData,
    problemSourceList
  } from '@/api/eventAcceptance.js'
  import axios from 'axios'
  import Cookies from "js-cookie";

  export default {
    data() {
      return {
        columns: [
          {
            title: '单号',
            align: 'center',
            width: 250,
            key: 'CASENO',
            render: (h, params) => {
              return h(
                'span', params.row.CASENO
              )
            }
          },
          {
            key: 'problemSourceName',
            title: '事件来源',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              let newArray = this.problemOriginList.map(item=>{
                if(item.code === params.row.PROBLEMORIGIN){
                  return item.text
                } else {
                  return ''
                }
              });
              return h(
                'span', newArray
              )
            }
          },
          {
            key: 'STATUS',
            title: '事件状态',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              let status = ''
              if (params.row.STATUS === '0') {
                status = '进行中'
              } else if (params.row.STATUS === '1') {
                status = '已办结'
              }
              return h(
                'span', {
                  style: { color: (status === '进行中') ? '#00afff' : '#008F4A' }
                }, status
              )
            }
          },
          {
            key: 'SHENDTIME',
            title: '应该截至时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              return h(
                'div',
                dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.SHENDTIME))
              )
            }
          },
          {
            key: 'GBENDTIME',
            title: '国标结束时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              if (params.row.GBENDTIME) {
                return h(
                  'div',
                  { style: { color: '#008F4A' } },
                  dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.GBENDTIME))
                )
              } else {
                return h(
                  'div', { style: { color: 'rgba(245, 154, 35, 0.6980392156862745)' } },
                  '进行中'
                )
              }
            }
          },
          {
            key: 'ENDTIME',
            title: '实际截止时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              if (params.row.ENDTIME) {
                return h(
                  'div',
                  { style: { color: '#008F4A' } },
                  dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.ENDTIME))
                )
              } else {
                return h(
                  'div', { style: { color: 'rgba(245, 154, 35, 0.6980392156862745)' } },
                  '进行中'
                )
              }
            }
          },
          {
            key: 'QUESTION',
            title: '问题描述',
            width: 'auto',
            align: 'center',
            tooltip: true
          },
          {
            key: 'handle',
            title: '操作',
            align: 'center',
            width: 300,
            render: (h, params) => {
              let temp = ''
              let type = ''
              if (params.row.superviseStatus === 0) {
                temp = '已督办'
                type = ''
              } else {
                temp = '督办'
                type = 'primary'
              }
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: type,
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.handleSupervise(params.row)
                      }
                    }
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
                        this.handleViewRow(params.row)
                      }
                    }
                  },
                  '流程图'
                )
              ])
            }
          }
        ],
        tableData: [],
        tableHeight: 'auto',
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
          checkFail: null
        },
        registerInfoQuery: {},
        rules: {
          name: [
            {
              required: true,
              message: '模型名称不可为空',
              trigger: 'blur',
              type: 'string'
            }
          ],
          key: [
            {
              required: true,
              message: '模型名称不可为空',
              trigger: 'blur',
              type: 'string'
            }
          ]
        },
        showModal: false,
        imgCodeUrl: '',
        modalForm: {
          name: ''
        },
        // 1.新增 2.编辑 3.查看
        formType: 1,
        rowData: {},
        bigList: [],
        smallList: [],
        filingList: [],
        assessmentUnitsList: [],
        filingConditionList: [],
        queryTimeTypeList:[
          {
            value: 0,
            name: '事件受理时间'
          },
          {
            value: 1,
            name: '事件结束时间'
          },
          {
            value: 2,
            name: '二级平台开始时间'
          },
          {
            value: 3,
            name: '二级平台结束时间'
          }
        ],
        departmentList: [],
        optionProps: {
          value: 'id',
          label: 'name',
          children: 'children',
          checkStrictly: true
        },
        problemOriginList: [], //事件来源list
        questionTypeList: [],
        topicList: [],
        interestList: [],
        userList: []
      }
    },
    created() {
      this.problemSourceList() // 获取事件来源
    },
    mounted() {
      this.getDeptTreeList()
      this.getBigList()
      this.handleSearch()

      this.getDictData('interest') // 兴趣点
      this.getDictData('question_type') // 事件类型
      this.getDictData('topic') //事件主题
      //  this.getAreaTree(); //获取所属区域
      this.listSimpleUsers() // 获取上报人
    },
    methods: {
      handleSearch() {
        this.tableLoading = true
        const params = {
          ...this.searchForm,
          deptKind: 1,
          pageNo: this.currentPageNum,
          pageSize: this.pageSize
        }
        if (params.deptId) {
          params.deptId = this.searchForm.deptId[this.searchForm.deptId.length - 1]
        }
         this.registerInfoQuery = {
          caseNo: '',
          problemOrigin: '',
          questionType: '',
          area: '',
          street: '',
          community: '',
          grid: '',
          largeName: '',
          smallName: '',
          filingName: '',
          filingCondition: '',
          assessmentUnit: '',
          question: '',
          startDate: '',
          endDate: '',
          returnVisit: '',
          openid:''
          }
        let formData = new FormData();
        formData.append("page", this.currentPageNum -1);
        formData.append("size", this.pageSize);
        formData.append("username", Cookies.get('username'));
        // formData.append("registerInfoQuery", this.registerInfoQuery);
        formData.append("registerInfoQuery.caseNo", this.registerInfoQuery.caseNo);
        formData.append("registerInfoQuery.problemOrigin", this.registerInfoQuery.problemOrigin);
        formData.append("registerInfoQuery.questionType", this.registerInfoQuery.questionType);
        formData.append("registerInfoQuery.area", this.registerInfoQuery.area);
        formData.append("registerInfoQuery.street", this.registerInfoQuery.street);
        formData.append("registerInfoQuery.community", this.registerInfoQuery.community);
        formData.append("registerInfoQuery.grid", this.registerInfoQuery.grid);
        formData.append("registerInfoQuery.largeName", this.registerInfoQuery.largeName);
        formData.append("registerInfoQuery.smallName", this.registerInfoQuery.smallName);
        formData.append("registerInfoQuery.filingName", this.registerInfoQuery.filingName);
        formData.append("registerInfoQuery.filingCondition", this.registerInfoQuery.filingCondition);
        formData.append("registerInfoQuery.assessmentUnit", this.registerInfoQuery.assessmentUnit);
        formData.append("registerInfoQuery.question", this.registerInfoQuery.question);
        formData.append("registerInfoQuery.startDate", this.registerInfoQuery.startDate);
        formData.append("registerInfoQuery.endDate", this.registerInfoQuery.endDate);
        formData.append("registerInfoQuery.returnVisit", this.registerInfoQuery.returnVisit);
        formData.append("registerInfoQuery.openid", this.registerInfoQuery.openid);

        var that = this

        axios.post('/proxy/czslpt/app/casePage2',
           // 这里会匹配到前面我们设置的/proxy，代替为https://www.tianqiapi.com
           formData,
          {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
          ).then(function (response) {
          console.log(response)
          if(response.data.code === 0){
            that.tableData = response.data.list || []
            that.dataTotal = response.data.total || 0
          }
          that.tableLoading = false
        }).catch(function (error) {
          console.log(error)
        })
      },
      reset(name, flag) {
        this.$refs[name].resetFields()
        if (flag) {
          this.searchForm = {
            returnVisit: null,
            inspect: null,
            timeOut: null,
            finishStatus: null,
            delay: null,
            checkFail: null
          },
            this.search()
        }
      },
      search() {
        this.currentPageNum = 1
        this.pageSize = 10
        this.handleSearch()
      },
      handlePageChange(pageNum) {
        this.currentPageNum = pageNum
        this.handleSearch()
      },
      handlePageSizeChange(size) {
        this.currentPageNum = 1
        this.pageSize = size
        this.handleSearch()
      },
      handleViewRow(row) {
        const param = {
          processInstanceId: row.eventTaskInfo.procInstId
        }
        handleImage(param).then(res => {
          this.imgCodeUrl = res
          this.showModal = true
        })
      },
      handleSupervise(row) {
        if (row.superviseStatus === 0) {
          this.$Message.error('该事件已督办！')
        } else {
          const param = {
            caseNo: row.caseNo
          }
          handleSupervise(param).then(res => {
            if (res.code === 200) {
              this.$modal.msgSuccess('督办成功')
              this.handleSearch()
            }
          })
            .catch(() => {
              this.$Message.error('督办失败！')
            })
        }

      },
      handleCloseModal() {
        this.showModal = false
      },
      getBigList() {
        bigClassList()
          .then(response => {
            if (response.code === 200) {
              this.bigList = response.data
            } else {
              this.$Message.error(response.msg)
            }
          })
          .catch(() => {
            this.$Message.error('失败！')
          })
      },
      selectBigClass(value) {
        this.smallList = []
        this.filingList = []
        if (value) {
          const param = {
            parentId: value
          }
          bigClassList(param)
            .then(response => {
              if (response.code === 200) {
                this.smallList = response.data
              } else {
                this.$Message.error(response.msg)
              }
            })
            .catch(() => {
              this.$Message.error('失败！')
            })
        }

      },
      selectSmallClass(value) {
        this.filingList = []
        if (value) {
          const param = {
            parentId: value
          }
          bigClassList(param)
            .then(response => {
              if (response.code === 200) {
                this.filingList = response.data
              } else {
                this.$Message.error(response.msg)
              }
            })
            .catch(() => {
              this.$Message.error('失败！')
            })
        }
      },
      selectFilling(value) {
        this.assessmentUnitsList = []
        this.filingConditionList = []
        if (value) {
          const param = {
            filingId: value
          }
          const param1 = {
            classId: value
          }
          getInforList(param1)
            .then(response => {
              if (response.code === 200) {
                this.assessmentUnitsList = response.data
              } else {
                this.$Message.error(response.msg)
              }
            })
            .catch(() => {
              this.$Message.error('考核单位获取失败！')
            })
          getInfor(param).then(response => {
            if (response.code === 200) {
              this.filingConditionList = [response.data.filingCondition]
            } else {
              this.$Message.error(response.msg)
            }
          })
            .catch(() => {
              this.$Message.error('立案条件获取失败！')
            })
        }
      },
      getCheckedNodes(value) {
        console.log('value', value)
        const id = value[value.length - 1]
        const i = getTree(this.departmentList, id)
        this.searchForm.deptCode = i.code
      },
      getDeptTreeList() {
        getDeptTreeList().then(res => {
          if (res.code == 200) {
            this.departmentList = this.deleteChildren([res.data])
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      deleteChildren(arr) {
        let childs = arr
        for (let i = childs.length; i--; i > 0) {
          if (childs[i].children) {
            if (childs[i].children.length > 0) {
              this.deleteChildren(childs[i].children)
            } else {
              delete childs[i].children
            }
          }
        }
        return arr
      },
      // 字典表 事件类型，主题，兴趣点 question_type 事件类型 topic 事件主题 interest 兴趣点
      getDictData(type) {
        getDictData(type).then((res) => {
          if (res.code == 0) {
            if (type == 'interest') {
              this.interestList = res.data
            }
            if (type == 'question_type') {
              this.questionTypeList = res.data
            }
            if (type == 'topic') {
              this.topicList = res.data
            }
          }
        })
      },
      problemSourceList() {
        // problemSourceList().then((res) => {
        //   if (res.code == 200) {
        //     this.problemOriginList = res.data
        //   }
        // })
        axios.post('/proxy/czslpt/app/getDictionary',
          // 这里会匹配到前面我们设置的/proxy，代替为https://www.tianqiapi.com
          {dicCode:'problemOrigin'},
        ).then(res=> {
          console.log(res)
          if(res.data.code === 0){
            this.problemOriginList = res.data.list
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      listSimpleUsers() {
        listSimpleUsers().then(res => {
          if (res.code == 200) {
            this.userList = res.data
          }
        })
      },
      handlePush(row) {
        const param = {
          caseNo: row.caseNo,
        };
        this.$router.push({
          path: "/event/eventDetail",
          query: {
            caseNo: row.caseNo,
            caseStatus: 3,
          },
        });
      },
    }

  }
</script>

<style scoped>

</style>
