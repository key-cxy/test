import request from '@/utils/request'
import request1 from '@/utils/requestDJLD'

// 查询子系统列表
export function handleList(query) {
  return request({
    url: '/system/subsystem/page',
    method: 'get',
    params: query
  })
}

// 新增子系统
export function addSubSystem(data) {
  return request({
    url: '/system/subsystem/create',
    method: 'post',
    data: data
  })
}

// 修改子系统
export function updateSubSystem(data) {
  return request({
    url: '/system/subsystem/update',
    method: 'post',
    data: data
  })
}

// 删除子系统
export function delSubSystem(roleId) {
  return request({
    url: '/system/subsystem/delete?id=' + roleId,
    method: 'post'
  })
}

//获取下拉列表
export function handleSimpleList(query) {
  return request({
    url: '/system/subsystem/list-all-simple',
    method: 'get'
  })
}

//获取下拉列表
export function handleTypeList(query) {
  return request({
    url: '/system/dict-data/listByType?type=subSystem_type',
    method: 'get'
  })
}

//获取可访问系统
export function getUserSubSystem() {
  return request({
    url: '/system/subsystem/getUserSubSystem',
    method: 'get'
  })
}
//获取可访问系统
export function getUrl(id) {
  return request({
    url: '/system/subsystem/getUrl?id='+id,
    method: 'get'
  })
}

//获取可访问系统
export function subsystemTreeByRole(id) {
  return request({
    url: '/system/subsystem/subsystemTreeByRole',
    method: 'get'
  })
}

//获取可访问系统
// export function uploadLogo(param) {
//   //return request1.post("/comDjldPlatform/register-material/uploadLogo", param, {
//   return request1.post("/admin-api/infra/fastdfs/file", param, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }
// export function uploadLogo(param) {
//   //return request1.post("/comDjldPlatform/register-material/uploadLogo", param, {
//   return request1.post("/infra/fastdfs/file", param, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

export function uploadLogoApi(data) {
  return request({
    url: '/infra/fastdfs/file/upload',
    method: 'post',
    data:data
  })
}


export function uploadImageApi(data) {
  return request({
    url: '/infra/fastdfs/file/multiple/upload',
    method: 'post',
    data:data
  })
}


