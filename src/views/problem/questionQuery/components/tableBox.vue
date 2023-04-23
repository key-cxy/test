<template>
  <div class="table-box">
    <!-- <a-button type="primary" class="addSupplier" @click="add()">
      新增
    </a-button> -->
    <a-radio-group
      v-model="userType"
      @change="handleChangeRadio"
      button-style="solid"
    >
      <a-radio-button value="all"> 全部 </a-radio-button>
      <a-radio-button value="mine"> 我提出 </a-radio-button>
      <a-radio-button value="handle"> 我处理 </a-radio-button>
    </a-radio-group>
    <a-table
      :columns="columns"
      :dataSource="list"
      :pagination="pagination"
      @change="onChangeSort"
      :rowKey="
        (record, index) => {
          return index
        }
      "
      size="middle"
    >
      <a
        slot="taskNo"
        slot-scope="text, record"
        @click="handleShowDetail(record)"
        >{{ text }}</a
      >
      <span slot="action" slot-scope="text, record">
        <a-button type="primary" @click="handleViewRow(record)"
          >流程图</a-button
        >
        <!-- <a-popconfirm
          title="确定删除？"
          @confirm="delConfirm(record)"
          okText="确定"
          cancelText="取消"
        >
          <a-button type="danger" size="small">删除</a-button>
        </a-popconfirm> -->
      </span>
    </a-table>

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
import { mapState, mapActions } from 'vuex'
import { handleImage } from '@/api/event/search'

export default {
  name: 'tableBox',
  components: {},
  mounted() {
    this.handleSearch()
  },
  computed: {
    ...mapState({
      list: (state) => state.questionQuery.list,
      pageNum: (state) => state.questionQuery.pageNum,
      pageSize: (state) => state.questionQuery.pageSize,
      total: (state) => state.questionQuery.total,
      userType: (state) => state.questionQuery.userType
    }),
    rowSelection() {
      const { selectedRows } = this
      return {
        selectedRows,
        onChange: this.onSelectChange,
        hideDefaultSelections: true
      }
    }
  },
  data() {
    return {
      selectedRows: [],
      columns: [
        {
          title: '单号',
          dataIndex: 'taskNo',
          key: 'taskNo',
          align: 'center',
          scopedSlots: { customRender: 'taskNo' }
        },
        {
          title: '问题描述',
          dataIndex: 'question',
          key: 'question',
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'feedbackName',
          key: 'feedbackName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'feedbackTime',
          key: 'feedbackTime',
          align: 'center'
        },
        {
          title: '当前节点',
          dataIndex: 'jdName',
          key: 'jdName',
          align: 'center'
        },
        {
          title: '期望完成时间',
          dataIndex: 'expectTime',
          key: 'expectTime',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共找到 ${total} 条结果`,
        total: 0
      },
      sort: {
        column: '',
        order: ''
      },
      showModal: false,
      imgCodeUrl: ''
    }
  },
  watch: {
    list() {
      this.pagination.total = this.total
    },
    pageNum() {
      this.pagination.current = this.pageNum
      this.pagination.pageNo = this.pageNum
    }
  },
  methods: {
    ...mapActions({
      handleSearchInfo: 'questionQuery/handleSearchInfo',
      handlePageData: 'questionQuery/handlePageData',
      handlePagination: 'questionQuery/handlePagination',
      handleChangeUserType: 'questionQuery/handleChangeUserType'
    }),
    handleSearch() {
      this.handleSearchInfo().then(() => {
        this.handlePageData()
      })
    },
    onChangeSort(page, filters, sorter) {
      this.pagination.pageNo = page.current
      this.pagination.pageSize = page.pageSize
      if (sorter && sorter.column) this.sort.column = sorter.column.dataIndex
      if (sorter && sorter.column) this.sort.order = sorter.order
      this.handlePagination({
        page: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        column: this.sort.column,
        order: this.sort.order ? (this.sort.order === 'ascend' ? 2 : 1) : ''
      }).then(() => {
        this.handlePageData()
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
    },
    addWarehouseInfo() {
      this.$emit('addOrEditWarehouseInfo')
    },
    handleChangeRadio(e) {
      this.handleChangeUserType(e.target.value)
      this.handleSearch()
    },
    handleShowDetail(record) {
      this.$emit('showDetail', record)
    },
    handleViewRow(row) {
      const param = {
        processInstanceId: row.processInstanceId
      }
      handleImage(param).then((res) => {
        this.imgCodeUrl = res
        this.showModal = true
      })
    },
    handleCloseModal() {
      this.showModal = false
    }
    // delConfirm({ id }) {
    //   const formData = new FormData()
    //   formData.append('storageId', id)
    //   delWareHouseInfo(formData).then((res) => {
    //     if (res.code === 200) {
    //       message.success(res.msg)
    //       this.handlePageData()
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-pagination.ant-pagination {
  margin: 40px 10px 40px 0px;
}
.table-box {
  /deep/ .ant-table-row {
    height: 64px !important;
  }
}
// 修改进度文字大小
/deep/ .ant-progress-text {
  font-size: 0.75rem !important;
}
.addSupplier {
  color: white;
  margin: 0 15px 15px 15px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
