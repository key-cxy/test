import requestDJLD from '@/utils/requestDJLD'
import request from '@/utils/request'

// 获取列表
export function handlePageData(params) {
  return requestDJLD({
    url: `/feedbackProblemInfo/listPage2`,
    method: 'POST',
    data: params
  })
}
// 新增仓储
export function handleAddPop(params) {
  return request({
    url: `${supplierGovern}/storage/saveStorage`,
    method: 'POST',
    data: params
  })
}

// 编辑货品
export function handleEditPop(params) {
  return request({
    url: `${supplierGovern}/food/updFood`,
    method: 'POST',
    data: params
  })
}

// 导出
export function handleDownLoad(params) {
  return request({
    url: `${supplierGovern}/storage/exportStorage`,
    method: 'POST',
    data: params,
    responseType: 'blob'
  })
}

// 获取搜索条件
export function handleProblemList(data) {
  return request({
    url: '/system/dict-data/getDictionary',
    method: 'post',
    data
  })
}

// 删除记录
export function delWareHouseInfo(params) {
  return request({
    url: `${supplierGovern}/storage/deleteStorageById`,
    method: 'POST',
    data: params
  })
}

// 查看详情
export function handleGetDetail(data) {
  return requestDJLD({
    url: `/feedbackProblemInfo/pageDataView`,
    method: 'POST',
    data
  })
}
