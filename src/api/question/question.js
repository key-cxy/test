import request from '@/utils/requestDJLD'
// 获取问题来源列表
export function handleList(query) {
  return request({
    url: '/problemSource/list',
    method: 'post',
    data: query
  })
}
// 获取问题来源列表
export function handleAdd(query) {
  return request({
    url: '/problemSource/create',
    method: 'post',
    data: query
  })
}
// 获取问题来源列表
export function handleDelete(query) {
  return request({
    url: '/problemSource/delete',
    method: 'get',
    params: query
  })
}
// 获取问题来源列表
export function handleUpdate(query) {
  return request({
    url: '/problemSource/update',
    method: 'post',
    data: query
  })
}
// 获取问题来源列表
export function handleUpdateStatus(query) {
  return request({
    url: '/problemSource/updateStatus',
    method: 'post',
    params: query
  })
}
