import request from '@/utils/requestDJLD'

// 获取列表
export function handleGetList(id) {
  return request({
    url: '/comDjldPlatform/bass-class-config/getList?parentId='+id,
    method: 'get',
  })
}
// 获取列表
export function filingConditionQuery(param) {
  return request({
    url: '/comDjldPlatform/filing-condition/filingConditionQuery',
    method: 'get',
    params: param
  })
}

// 获取列表
export function classQuery(param) {
  return request({
    url: '/comDjldPlatform/bass-class-config/classQuery',
    method: 'get',
    params: param
  })
}

// 获取部门树
export function getDeptTreeList() {
  return request({
    url: '/comDjldPlatform/dept/queryTree',
    method: 'get',
  })
}
// 大小类树
export function getClassTreeList(param) {
  return request({
    url: '/comDjldPlatform/bass-class-config/queryTree',
    method: 'get',
    params: param
  })
}
