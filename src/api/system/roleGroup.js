import request from '@/utils/request'

// 查询角色组列表
export function listRoleGroup(query) {
  return request({
    url: '/system/role-group/page',
    method: 'get',
    params: query
  })
}



// 新增角色组
export function addRoleGroup(data) {
  return request({
    url: '/system/role-group/create',
    method: 'post',
    data: data
  })
}

// 修改角色组
export function updateRoleGroup(data) {
  return request({
    url: '/system/role-group/update',
    method: 'post',
    data: data
  })
}

// 删除角色组
export function delRoleGroup(roleId) {
  return request({
    url: '/system/role-group/delete?id=' + roleId,
    method: 'post'
  })
}
