import {
  handlePageData,
  handleAddPop,
  handleEditPop,
  handleDownLoad,
  handleProblemList,
  handleGetDetail,
  handleQuestion
} from '@/api/problem/questionHandle'
import { Promise } from 'bluebird'
const questionHandle = {
  namespaced: true,

  state: {
    loading: false,
    list: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    // 排序字段
    column: '',
    // 排序方向
    sort: '',
    // 搜索条件
    searchInfo: {},
    userType: 'all'
  },

  mutations: {
    HANDLE_LOADING: (state) => {
      state.loading = !state.loading
    },
    HANDLE_PAGE_DATA: (state, { data }) => {
      state.list = data.list
      state.total = data.total
    },
    HANDLE_PAGINATION: (state, data) => {
      state.pageNum = data.page
      state.pageSize = data.pageSize
      state.column = data.column
      state.sort = data.order
    },
    HANDLE_SEARCH_INFO: (state, data) => {
      state.pageNum = 1
      state.pageSize = 10
      state.column = ''
      state.sort = ''
      state.searchInfo = data
    },
    HANDLE_CHANGE_USERTYPE: (state, data) => {
      state.userType = data
    }
  },

  actions: {
    /**
     * 获取表格数据
     */
    handlePageData({ commit, state }) {
      commit('HANDLE_LOADING')
      let params = {
        page: state.pageNum,
        size: state.pageSize,
        // userType: state.userType,
        ...state.searchInfo
      }
      // const formData = new FormData();
      // formData.append("page", state.pageNum);
      // formData.append("size", state.pageSize);
      // for (const key in state.searchInfo) {
      //   formData.append(key, state.searchInfo[key]);
      // }
      return new Promise((resolve, reject) => {
        handlePageData(params)
          .then((res) => {
            resolve(res)
            commit('HANDLE_PAGE_DATA', res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    // 新增
    handleAddPop({ commit }, values) {
      const formData = new FormData()
      formData.append('storageName', values.storageName)
      formData.append('storageSource', values.storageSource)
      formData.append('price', values.price)
      formData.append('total', values.total)
      formData.append('enterpriseId', values.enterpriseId)
      if (values.multipartFile)
        formData.append('multipartFile', values.multipartFile)
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleAddPop(formData)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    // 编
    handleQuestion({ commit }, values) {
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleQuestion(values)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    handleEditPop({ commit }, values) {
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleEditPop(values)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    // 获取搜索下拉列表
    handleProblemList({ commit }, data) {
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleProblemList(data)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },

    handleGetDetail({ commit }, data) {
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleGetDetail(data)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    // 导出表格
    handleDownLoad({ commit, state }) {
      const params = new FormData()
      params.append('pageNum', state.pageNum)
      params.append('pageSize', state.pageSize)
      for (const key in state.searchInfo) {
        params.append(key, state.searchInfo[key])
      }
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleDownLoad(params)
          .then((res) => {
            // 创建一个a标签
            const oA = document.createElement('a')
            oA.href = window.URL.createObjectURL(
              new Blob([res], { type: 'application/octet-stream' })
            )
            // 给文件命名
            oA.download = '仓储管理导出当前页.xlsx'
            // 模拟点击
            oA.click()
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    // 导出表格
    handleDownLoadAll({ commit, state }) {
      const params = new FormData()
      for (const key in state.searchInfo) {
        params.append(key, state.searchInfo[key])
      }
      commit('HANDLE_LOADING')
      return new Promise((resolve, reject) => {
        handleDownLoad(params)
          .then((res) => {
            // 创建一个a标签
            const oA = document.createElement('a')
            oA.href = window.URL.createObjectURL(
              new Blob([res], { type: 'application/octet-stream' })
            )
            // 给文件命名
            oA.download = '仓储管理导出全部.xlsx'
            // 模拟点击
            oA.click()
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            commit('HANDLE_LOADING')
          })
      })
    },
    /**
     * 修改查询实体
     */

    handleChangeUserType({ commit }, data) {
      commit('HANDLE_CHANGE_USERTYPE', data)
    },

    handleSearchInfo({ commit }, data) {
      commit('HANDLE_SEARCH_INFO', data)
    },
    /**
     * 修改页数和页码
     */
    handlePagination({ commit }, data) {
      commit('HANDLE_PAGINATION', data)
    }
  }
}

export default questionHandle
