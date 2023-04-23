// import request from '@/utils/requestJQFX'
import request from '@/utils/request'
export function getList() {
    return request({
        url: '/api/test/get',
        method: 'get'
    })
}
export function listUser(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}
export function getAccountTreeApi() {
  return request({
    url: '/system/organization/queryTree',
    method: 'get',
  })
}
//查询弹框工作岗位
export function getDiglogworkApi() {
  return request({
    url: '/system/post/list-all-simple',
    method: 'get',
  })
}
//新增用户接口
export function postAddUserApi(data) {
  return request({
    url: '/system/user/create',
    method: 'post',
    data
  })
}
//修改查询
export function getUserApi(params) {
  return request({
    url: '/system/user/get',
    method: 'get',
    params
  })
}
//修改查询
export function updateUserApi(data) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data
  })
}
