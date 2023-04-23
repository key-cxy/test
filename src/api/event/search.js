import request from '@/utils/requestDJLD'

// 获取事件查询列表
export function handleList (query) {
  return request({
    url: '/eventHandle/eventList',
    method: 'post',
    data: query
  })
}

// 获取咨询查询列表
export function handleConsultingList (query) {
  return request({
    url: '/eventHandle/advisoryList',
    method: 'post',
    data: query
  })
}
// 获取咨询查询列表
export function handlEventSaveList (query) {
  return request({
    url: '/eventHandle/eventSaveList',
    method: 'post',
    data: query
  })
}
// 获取高亮流程图
export function handleImage (query) {
  return request({
    url: '/comDjldPlatform/acti/image',
    method: 'get',
    params: query
  })
}

//获取大类选择列表
export function getInforList (param) {
  return request({
    url: '/comDjldPlatform/class-unit/getUnitByClass',
    method: 'get',
    params: param
  })
}

//获取考核单位
export function getAssessmentUnit (param) {
  return request({
    url: '/comDjldPlatform/dept/getAssessmentUnit',
    method: 'get',
    params: param
  })
}


//导出
export function exportExcels (param) {
  return request({
    url: '/comDjldPlatform/register-info/exportExcel',
    method: 'post',
    data: param,
    responseType: 'blob'
  })
}

//获取大类选择列表
export function getInfor (param) {
  return request({
    url: '/comDjldPlatform/filing-condition/getInfor',
    method: 'get',
    params: param
  })
}


/**
 * 暂存
 */
// 获取暂存列表
export function getTemporarySaveInfo (query) {
  return request({
    url: '/pc/eventSaveList',
    method: 'post',
    data: query
  })
}
// 获取暂存详情
export function getTemporarySaveDetail (query) {
  return request({
    url: '/pc/getStoreRegisterInfo',
    method: 'get',
    params: query
  })
}
