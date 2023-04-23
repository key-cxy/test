import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUserGroup(query) {
  return request({
    url: "/system/workgroup/page",
    method: "post",
    data: query,
  });
}

export function createUserGroup(data) {
  return request({
    url: "/system/workgroup/create",
    method: 'post',
    data,
  });
}

// 用户组状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: "/system/workgroup/update-status",
    method: "put",
    data: data,
  });
}

// 删除用户组
export function delUserGroup(userId) {
  return request({
    url: "/system/workgroup/delete?ids=" + userId,
    method: "delete",
  });
}

// 查询用户组详细
export function getUserGroup(userId) {
  return request({
    url: "/system/workgroup/get?id=" + praseStrEmpty(userId),
    method: "get",
  });
}


// 部门下可配置人员的列表
export function getPeopleByDept(id) {
  return request({
    url: "/system/user/getByDept?deptId=" + id,
    method: "get",
  });
}
// 修改用户组
export function updateUserGroup(data) {
  return request({
    url: "/system/workgroup/update",
    method: "put",
    data: data,
  });
}

