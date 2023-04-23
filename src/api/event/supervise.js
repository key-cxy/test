import request from '@/utils/requestDJLD'

// 获取事件处置列表
export function handleList(query) {
  return request({
    url: '/eventSupervise/getMySuperviseEvents',
    method: 'post',
    data: query
  })
}
// 添加事件督办
export function handleSupervise(query) {
  return request({
    url: '/eventSupervise/supervise',
    method: 'post',
    data: query
  })
}

// 修改状态
export function handleUpdateStatus(query) {
  return request({
    url: '/eventSupervise/updateStatus',
    method: 'get',
    params: query
  })
}
// 修改状态
export function handleDelete(query) {
  return request({
    url: '/eventSupervise/delete',
    method: 'get',
    params: query
  })
}
