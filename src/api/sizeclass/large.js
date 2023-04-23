import request from '@/utils/requestDJLD'

// 获取左侧大小类树
export function handleGetTreeList(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/queryTree',
    method: 'get',
    params: query
  })
}
//获取大类列表
export function bigClassQuery(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/bigClassQuery',
    method: 'get',
    params: query
  })
}
//根据id删除类
export function handleDelRow(id) {
  return request({
    url: '/comDjldPlatform/bass-class-config/del?id='+id,
    method: 'post',
  })
}
// 修改大类状态
export function changeStatus(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/changeStatus',
    method: 'post',
    data: query
  })
}
// 添加大类
export function handleAdd(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/add',
    method: 'post',
    data: query
  })
}

// 修改大类
export function handleUpdate(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/update',
    method: 'post',
    data: query
  })
}
// 获取部门树
export function getDeptTreeList() {
  return request({
    url: '/comDjldPlatform/dept/queryTree',
    method: 'get',
  })
}
