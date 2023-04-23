import request from '@/utils/request'

// 创建应用配置
export function createForm(data) {
  return request({
    url: '/system/applyConfig/create',
    method: 'post',
    data: data
  })
}
//应用配置查询接口
export function getData(query) {
    return request({
      url: '/system/applyConfig/page',
      method: 'get',
      params: query
    })
  }
  //应用配置删除接口
export function deleteList(data) {
    return request({
        url: '/system/applyConfig/delete',
        method: 'delete',
        params:data
    })
}
  //应用配置修改接口
 export function updateList(data) {
    return request({
        url: '/system/applyConfig/update',
        method: 'put',
        data: data
    })
}
//应用配置上传图片
export function upload(data) {
    return request({
      url: '/infra/fastdfs/file/upload',
      method: 'post',
      data: data
    })
  }
//子系统跳转菜单
export function changeSubsystem() {
    return request({
      url: '/system/subsystem/list-all-simple',
      method: 'get',
     
    })
  }
  //树
  export function treeData() {
    return request({
      url: '/system/applyConfig/tree-query',
      method: 'get',
    })
  }
  //获取所在类型下拉框值
  export function selectList() {
    return request({
      url: '/system/applyConfig/list',
      method: 'get',
     
    })
  }
   //获取所属系统下拉框值
   export function getSystemType() {
    return request({
      url: '/system/subsystem/getSystemType',
      method: 'get',
     
    })
  }
   //获取所属菜单下拉框值
   export function getmenus(query) {
    return request({
      url: '/system/menu/list-tree-menu',
      method: 'get',
      params:query
     
    })
  }