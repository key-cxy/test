import request from '@/utils/request'


//获取菜单人员列表
export function getMenu(query) {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params:query
    })
}


//创建菜单
export function createMenu(data) {
    return request({
        url: '/system/menu/create',
        method: 'post',
        params:data
    })
}

//修改菜单接口
export function updateMenu(data) {
    return request({
        url: '/system/menu/update',
        method: 'put',
        params:data
    })
}

//菜单信息接口
export function menuInformation(id) {
    return request({
        url: '/system/menu/get?id='+id,
        method: 'get',
    })
}

//删除菜单
export function deleteMenu(data) {
    return request({
        url: '/system/menu/delete',
        method: 'delete',
        params:data
    })
}

//菜单树接口
export function listMenu(data) {
    return request({
        url: '/system/auth/list-menus',
        method: 'get',
        params:data
    })
}

//菜单下拉框接口
export function menuSelect(data) {
    return request({
        url: '/system/menu/list-all-simple',
        method: 'get',
        params:data
    })
}
// //菜单左侧树接口
// export function menuTreeApi(data) {
//     return request({
//         url: 'system/subsystem/getSubsystemTree',
//         method: 'get',
//         params:data
//     })
// }
//菜单左侧树接口
export function menuTreeApi(data) {
    return request({
        url: 'system/subsystem/list-all-simple',
        method: 'get',
        params:data
    })
}
//点击左侧树接口
export function getTreeIdApi(data) {
    return request({
        // url: `/system/menu/list?systemId=${data}`,
        url: `/system/menu/list`,
        method: 'get',
        // params:{systemId:data}
         params:data
    })}
//点击上方搜所接口
export function getTreeQueryValueApi(data) {
    return request({
        // url: `/system/menu/list?systemId=${data}`,
        url: `/system/menu/list`,
        method: 'get',
        data
    })
}
export function addMenuApi(data) {
    return request({
        url: "/system/menu/create",
        method: 'post',
        data
    })
}
export function updateMenuApi(data) {
    return request({
        url: "/system/menu/update",
        method: 'put',
        data
    })
}
export function deleteMenuApi(params) {
  return request({
    url: "/system/menu/delete",
    method: 'DELETE',
    params
  })
}




