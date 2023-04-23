import request from '@/utils/request'

export function getUserData(data) {
    return request({
        url: '/system/organization/list-dimensions',
        method: 'get',
        params: data

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
        url: '/system/organization/create-dimensions',
        method: 'post',
        data:data,
    })
}