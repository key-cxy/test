import request from '@/utils/request'


//进页面调接口查所有数据
export function getUser(query) {
    return request({
        url: '/system/organization/list-deptInstitution',
        method: 'get',
        params: query

    })
}

//修改按钮接口
export function getOrganization(id) {
    return request({
        url: '/system/organization/get-organization?id=' + id,
        method: 'get',

    })
}

//修改按钮弹窗页面里的确定按钮接口
export function determine(data) {
    return request({
        url: '/system/organization/update-organization',
        method: 'put',
        data:data,
    })
}

//删除按钮接口
export function deleteContent(id) {
    return request({
        url: '/system/organization/delete-organization?id=' +id,
        method: 'delete',
    })
}

//新增按钮接口
export function add(data) {
    return request({
        url: '/system/organization/create-institution',
        method: 'post',
        data:data,
    })
}

//组织机构获取接口
// export function mechanismAcquisition(data) {
//     return request({
//         url: '/system/organization/list-organizationAffiliation',
//         method: 'get',
//         data:data,
//     })
// }

//查询所属行政区划获取接口
export function division(query) {
    return request({
        url: '/system/district/getAllName',
        method: 'get',
        data:query,
    })
}

//弹窗所属行政区划获取接口
export function divisionData(query) {
    return request({
        url: '/system/district/getTreeDistrict',
        method: 'get',
        params:query,
    })
}

//新增弹窗获取上级组织机构接口
export function superiorOrganization(data) {
    return request({
        url: '/system/organization/list-parentOrganization',
        method: 'get',
        data:data,
    })
}

// //根据上级组织机构的id值来查区划
// export function regionalization(data) {
//     return request({
//         url: '/system/district/getById',
//         method: 'get',
//         params:data,
//     })
// }

//获取左侧下拉菜单接口
export function organization(query) {
    return request({
        url: '/system/organization/queryTree',
        method: 'get',
        params:query,
    })
}

//获取弹窗里的组织机构结构树接口
export function organizationTree(query) {
    return request({
        url: '/system/organization/queryTree',
        method: 'get',
        params:query,
    })
}



