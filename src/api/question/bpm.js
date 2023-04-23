import request from '@/utils/requestDJLD'
import request1 from '@/utils/request'
// 获取问题来源列表
export function handleList(query) {
  return request({
    url: '/problemSource/bpmList',
    method: 'post',
    data: query
  })
}
// 获取问题来源下拉列表
export function handleSimpleList() {
  return request({
    url: '/problemSource/simpleList?bpmFlag=2',
    method: 'get',
  })
}

// 获得未绑定问题来源的有效流程定义列表
export function handleProcDefKeyList(param) {
  return request({
    url: '/comDjldPlatform/acti/procDefKeyList',
    method: 'get',
    params: param
  })
}
// 问题来源绑定流程
export function handleAdd(query) {
  return request({
    url: '/problemSource/bindbpm',
    method: 'post',
    data: query
  })
}

// 问题来源绑定流程修改
export function handleUpdate(query) {
  return request({
    url: '/problemSource/updateBpmBind',
    method: 'post',
    data: query
  })
}
// 修改状态
export function handleUpdateStatus(query) {
  return request({
    url: '/problemSource/updateBpmStatus',
    method: 'post',
    params: query
  })
}

// 删除
export function handleDelete(query) {
  return request({
    url: '/problemSource/deleteBpm',
    method: 'get',
    params: query
  })
}

//获取下拉列表
export function handleLabelList(query) {
  return request1({
    url: '/system/dict-data/listByType?type=problem_source_label',
    method: 'get'
  })
}
