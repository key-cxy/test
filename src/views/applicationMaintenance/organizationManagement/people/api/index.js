import request from '@/utils/request'


//进页面查询所有数据
export function getPersonnel(query) {
    return request({
        url: '/system/personnel/list-personnel',
        method: 'get',
        params:query
    })
}

//修改按钮接口
export function getModify(id) {
    return request({
        url: '/system/personnel/get-personnel?id='+id,
        method: 'get',
    })
}

//新增按钮接口
export function add(data) {
    return request({
        url: '/system/personnel/create-personnel',
        method: 'post',
        data:data
    })
}

//修改按钮弹窗页面里的确定按钮接口
export function determine(data) {
    return request({
        url: '/system/personnel/update-personnel',
        method: 'put',
        data:data,
    })
}

//删除按钮接口
export function deleteContent(id) {
    return request({
        url: '/system/personnel/delete-personnel?id=' +id,
        method: 'delete',
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


//弹窗里的职务下拉框接口
export function positionSelect(data) {
    return request({
        url: '/system/post/list-all-simple',
        method: 'get',
        params:data,
    })
}
