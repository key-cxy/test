import request from '@/utils/requestDJLD'

// 获取事件处置列表
export function handleList(query) {
  return request({
    url: '/eventHandle/taskList',
    method: 'post',
    data: query
  })
}

// 事件认领
export function handleClaimTask(query) {
  return request({
    url: '/eventHandle/claimTask',
    method: 'post',
    params: query
  })
}
// 事件详情
export function handleCaseView(query) {
  return request({
    url: '/comDjldPlatform/app/caseView',
    method: 'post',
    data: query
  })
}
