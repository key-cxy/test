import request from '@/utils/request'
import { getToken } from "@/utils/auth";

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单（精简)列表
export function listSimpleMenus(data) {
  return request({
    url: '/system/menu/list-tree-menu',
    method: 'get',
    params:data
  })
}

// 查询菜单详细
export function getMenu(id) {
  return request({
    url: '/system/menu/get?id=' + id,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu/create',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu/update',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(id) {
  return request({
    url: '/system/menu/delete?id=' + id,
    method: 'delete'
  })
}

// 根据字典类型获取数据
export function listData(query) {
  return request({
    url: '/system/subsystem/getSystemType',
    method: 'get',
    headers:{
      'Authorization': "Bearer " + getToken(),
    },
    params: query
  })
}
