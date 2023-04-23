import request from '@/utils/requestDJLD'

// 获取事件查询列表
export function handleList(query) {
  return request({
    url: '/errorApply/taskList',
    method: 'post',
    data: query
  })
}
// 大小类查询所有的最新版本的内容
export function handleTest() {
  return request({
    url: '/comDjldPlatform/bass-class-config/selclassall',
    method: 'post',
  })
}

export function getButtons(param) {
  return request({
    url: '/comDjldPlatform/acti/getButtons',
    method: 'get',
    params: param
  })
}

export function handlePost(query) {
  return request({
    url: '/errorApply/handle',
    method: 'post',
    data: query
  })
}

// 事件详情
export function handleErrorApplyView(query) {
  return request({
    url: '/errorApply/errorApplyView',
    method: 'get',
    params: query
  })
}
