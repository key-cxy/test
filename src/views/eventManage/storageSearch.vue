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
        <Select v-model="searchForm.problemSourceId" style="width: 188px">
          <Option v-for="item in problemOriginList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
        <Select v-model="searchForm.select" style="width: 188px">
          <Option value="beijing">test</Option>
        </Select>
      </FormItem>
      <FormItem label="处置部门：">
        <Select v-model="searchForm.select" style="width: 188px">
          <Option value="beijing">test</Option>
        </Select>
      </FormItem>
      <FormItem label="所属大类：">
        <Select v-model="searchForm.largeId" style="width: 188px" @on-change="selectBigClass">
          <Option v-for="item in bigList" :value="item.id" :key="item.id">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属小类：">
        <Select v-model="searchForm.smallId" style="width: 188px" @on-change="selectSmallClass">
          <Option v-for="item in smallList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案名称：">
        <Select v-model="searchForm.filingId" style="width: 188px" @on-change="selectFilling">
          <Option v-for="item in filingList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="立案条件：">
        <Input
          style="width: 188px"
          v-model="searchForm.filingCondition"
          placeholder="立案条件"
        />
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
        <DatePicker type="date" placeholder="请选择开始时间" v-model="searchForm.beginCreateTime"></DatePicker>
      </FormItem>
      <FormItem label="结束时间：">
        <DatePicker type="date" placeholder="请选择结束时间" v-model="searchForm.endCreateTime"></DatePicker>
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
        <Button type="primary" icon="md-search">导 出</Button>
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
  import { handlEventSaveList, handleImage, getInforList } from '@/api/event/search'
  import getTree from '@/libs/tree.js'
  import { getDeptTreeList } from '@/api/sizeclass/dept'
  import { bigClassList } from '@/api/sizeclass/sub'
  import { listSimpleUsers } from '@/api/system/user'
  import {
    getDictData,
    problemSourceList
  } from '@/api/eventAcceptance.js'

  export default {
    data() {
      return {
        columns: [
          {
            title: '单号',
            align: 'center',
            width: 250,
            key: 'eventTaskInfo',
            render: (h, params) => {
              return h(
                'span', params.row.eventTaskInfo.caseNo
              )
            }
          },
          {
            key: 'problemSourceName',
            title: '事件来源',
            width: 'auto',
            align: 'center',
            tooltip: true
          },
          {
            key: 'eventTaskInfo',
            title: '事件状态',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              let status = ''
              if (params.row.eventTaskInfo.status === '0') {
                status = '进行中'
              } else if (params.row.eventTaskInfo.status === '1') {
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
            key: 'shEndTime',
            title: '应该截至时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              return h(
                'div',
                dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.eventTaskInfo.shEndTime))
              )
            }
          },
          {
            key: 'gbShEndTime',
            title: '国标结束时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              return h(
                'div',
                { style: { color: '#008F4A' } },
                dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.eventTaskInfo.gbShEndTime))
              )
            }
          },
          {
            key: 'endTime',
            title: '实际截止时间',
            width: 'auto',
            align: 'center',
            tooltip: true,
            render: (h, params) => {
              if (params.row.eventTaskInfo.endTime) {
                return h(
                  'div',
                  { style: { color: '#008F4A' } },
                  dateFmt('YYYY-mm-dd HH:MM:SS', new Date(params.row.eventTaskInfo.endTime))
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
            key: 'assessmentUnitName',
            title: '处置单位/考核单位',
            width: 'auto',
            align: 'center',
            tooltip: true
          },
          {
            key: 'collectorUserName',
            title: '采集人员',
            width: 'auto',
            align: 'center',
            tooltip: true
          },
          {
            key: 'handle',
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                      }
                    }
                  },
                  '操作'
                ),
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
          name: null,
          key: null
        },
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
        userList:[]
      }
    },
    mounted() {
      this.getDeptTreeList()
      this.getBigList()
      this.handleSearch()

      this.getDictData('interest') // 兴趣点
      this.getDictData('question_type') // 事件类型
      this.getDictData('topic') //事件主题
      //  this.getAreaTree(); //获取所属区域
      this.problemSourceList() // 获取事件来源
      this.listSimpleUsers() // 获取上报人
    },
    methods: {
      handleSearch() {
        this.tableLoading = true
        const params = {
          pageNo: this.currentPageNum,
          pageSize: this.pageSize
        }
        handlEventSaveList(params)
          .then(res => {
            if (res.code == 200) {
              this.tableData = res.data.records || []
              this.dataTotal = res.data.total || 0
            } else {
              this.$Message.error({
                content: res.msg,
                duration: 2
              })
            }
            this.tableLoading = false
          })
          .catch(error => {
            console.log(error)
            this.tableLoading = false
            // this.$Message.error({
            //   content: '获取数据失败!',
            //   duration: 2
            // })
          })
      },
      reset(name, flag) {
        this.$refs[name].resetFields()
        if (flag) {
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
        if (value) {
          const param = {
            filingId: value
          }
          getInforList(param)
            .then(response => {
              if (response.code === 200) {
                this.assessmentUnitsList = response.data
              } else {
                this.$Message.error(response.msg)
              }
            })
            .catch(() => {
              this.$Message.error('失败！')
            })
        }
      },
      getCheckedNodes(value) {
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
        problemSourceList().then((res) => {
          if (res.code == 200) {
            this.problemOriginList = res.data
          }
        })
      },
      listSimpleUsers(){
        listSimpleUsers().then(res=>{
          if(res.code == 200){
            this.userList = res.data
          }
        })
      }
    }

  }
</script>

<style scoped>

</style>
