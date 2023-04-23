import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/page',
    method: 'get',
    params: query
  })
}

// 获取用户精简信息列表
export function listSimpleUsers() {
  return request({
    url: '/system/user/list-all-simple',
    method: 'get'
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/get?id=' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/create',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/delete?id=' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 用户密码重置
export function resetUserPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/system/user/update-password',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/user/update-status',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile/get',
    method: 'get'
  })
}

export function getUserSimple() {
  return request({
    url: '/system/user/getUser',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  // return request({
  //   url: '/system/user/profile/update',
  //   method: 'put',
  //   data: data
  // })
  return request({
    url: '/system/user/profile/update4App',
    method: 'post',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword,code,mobile) {
  const data = {
    oldPassword,
    newPassword,
    code,
    mobile
  }
  return request({
    url: '/system/user/profile/update-password',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/update-avatar',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'multipart-formData'
    },
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}


//根据部门获取岗位列表
export function getWorkByDept(id) {
  return request({
    url: "/system/dept/deptPostList?id=" + id,
    method: "get",
  });
}
//根据deptId查询用户组列表
export function getUserGroupByDept(id) {
  return request({
    url: "/system/workgroup/listByDeptId?deptId=" + id,
    method: "get",
  });
}

//根据deptId查询可访问系统角色列表
export function getRoleListByDept(id) {
  return request({
    url: "/system/role-group/roleInGroup",
    method: "get",
  });
}
//根据deptId查询处置人
export function getUserListByDept(param) {
  return request({
    url: "/system/user/getByDept",
    method: "get",
    params: param
  });
}
//发送短信验证码
export function sendSmsCode(param) {
  return request({
    url: "/system/user/profile/send-sms-code",
    method: "post",
    data: param
  });
}
//短信确认
export function sendSmsApi(param) {
  return request({
    url: "/system/user/profile/checkoutCode",
    method: "post",
    data: param
  });
}


