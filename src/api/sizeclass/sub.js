import request from '@/utils/requestDJLD'

//获取大类选择列表
export function bigClassList(param) {
  return request({
    url: '/comDjldPlatform/bass-class-config/getList',
    method: 'get',
    params: param
  })
}

//获取大类选择列表
export function smallClassQuery(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/smallClassQuery',
    method: 'get',
    params: query
  })
}

// 获取立案名称列表
export function filingClassQuery(query) {
  return request({
    url: '/comDjldPlatform/bass-class-config/filingClassQuery',
    method: 'get',
    params: query
  })
}

// 获取立案条件列表
export function filingConditionQuery(query) {
  return request({
    url: '/comDjldPlatform/filing-condition/filingConditionQuery',
    method: 'get',
    params: query
  })
}

// 修改立案条件状态
export function changeStatus(query) {
  return request({
    url: '/comDjldPlatform/filing-condition/changeStatus',
    method: 'post',
    data: query
  })
}

// 添加立案条件
export function handleAdd(query) {
  return request({
    url: '/comDjldPlatform/filing-condition/add',
    method: 'post',
    data: query
  })
}

// 修改立案条件
export function handleUpdate(query) {
  return request({
    url: '/comDjldPlatform/filing-condition/update',
    method: 'post',
    data: query
  })
}
