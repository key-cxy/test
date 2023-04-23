import request from '@/utils/requestDJLD'

// 获取列表
export function handleList(query) {
  return request({
    url: '/errorApplyBind/page',
    method: 'post',
    data: query
  })
}
// 删除
export function handleDelete(query) {
  return request({
    url: '/errorApplyBind/delete',
    method: 'get',
    params: query
  })
}

// 获取问题来源下拉列表
export function handleProblemSource(query) {
  return request({
    url: '/problemSource/simpleList?bpmFlag=0',
    method: 'get',
    params: query
  })
}

// 获取操作类型
export function handleGetDictData() {
  return request({
    url: '/comDjldPlatform/feign/getDictData?type=bpm_subbpm_errorApply_operateType',
    method: 'get',
  })
}

// 获得流程节点
export function listEventNodeByPSId(query) {
  return request({
    url: '/comDjldPlatform/acti/eventNodeListByProcDefKey',
    method: 'get',
    params: query
  })
}
// 获得绑定退回流程
export function getBpmByType(query) {
  return request({
    url: '/errorApplyBind/getBpmByType',
    method: 'get',
    params: query
  })
}
// 新增
export function handleAdd(query) {
  return request({
    url: '/errorApplyBind/create',
    method: 'post',
    data: query
  })
}

// 修改
export function handleUpdate(query) {
  return request({
    url: '/errorApplyBind/update',
    method: 'post',
    data: query
  })
}
// 修改状态
export function handleUpdateStatus(query) {
  return request({
    url: '/errorApplyBind/updateStatus',
    method: 'get',
    params: query
  })
}
