import request from '@/utils/request'


//获取所有人员数据
export function getData(query) {
    return request({
        url: '/system/subsystem/page',
        method: 'get',
        params:query
    })
}

//多文件上传接口
export function fileUpload(data) {
    return request({
        url: '/infra/fastdfs/file/multiple/upload',
        method: 'post',
        data:data
    })
}

//单文件上传接口
export function singleUpload(data) {
    return request({
        url: '/infra/fastdfs/file',
        method: 'post',
        data:data
    })
}


//新增接口
export function add(data) {
    return request({
        url: '/system/subsystem/create',
        method: 'post',
        data:data
    })
}

//删除按钮接口
export function deleteData(id) {
    return request({
        url: '/system/subsystem/delete?id='+id,
        method: 'post',
    })
}

//查看按钮接口
export function view(id) {
    return request({
        url: '/system/subsystem/getSubSystem?id='+id,
        method: 'get',
    })
}

//修改按钮接口
export function update(data) {
    return request({
        url: '/system/subsystem/update',
        method: 'post',
        data:data
    })
}

//修改删除图片接口
export function DeleteImage(data) {
  return request({
    url: '/system/subsystem/updatepicpath',
    method: 'post',
    params:data
  })
}
//修改图片接口
export function deleteImgApi(data) {
    return request({
        url: '/infra/fastdfs/file/delete',
        method: 'delete',
        params:data
    })
}




