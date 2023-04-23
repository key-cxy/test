import request from '@/utils/request'

// 查询列表
export function listAdvice(query) {
  return request({
    url: '/system/approveView/list',
    method: 'get',
    params: query
  })
}

// 删除意见
export function delAdvice(id) {
  return request({
    url: '/system/approveView/delete?id=' + id,
    method: 'post'
  })
}

// 新增意见
export function addAdvice(data) {
  return request({
    url: '/system/approveView/create',
    method: 'post',
    data: data
  })
}

// 修改意见
export function updateAdvice(data) {
  return request({
    url: '/system/approveView/update',
    method: 'post',
    data: data
  })
}
