import request from '@/utils/request'


//获取岗位人员列表
export function getPostList(query) {
    return request({
        url: '/system/post/page',
        method: 'get',
        params:query
    })
}

//新增岗位弹窗确定按钮接口
export function add(data) {
    return request({
        url: '/system/post/create',
        method: 'post',
        data:data
    })
}

//修改按钮接口
export function modify(id) {
    return request({
        url: '/system/post/get?id='+id,
        method: 'get',
    })
}

//修改按钮里面的确定按钮接口
export function update(data) {
    return request({
        url: '/system/post/update',
        method: 'put',
        data:data
    })
}

//删除按钮接口
export function deletedata(id) {
    return request({
        url: '/system/post/delete?id='+id,
        method: 'delete',
    })
}

//弹窗获取全部组织机构接口
export function allOrganization(data) {
    return request({
        url: '/system/organization/list-getAll',
        method: 'get',
        data:data
    })
}

//获取组织机构树接口
export function organization(query) {
    return request({
        url: '/system/organization/queryTree',
        method: 'get',
        params:query,
    })
}


