import request from '@/utils/request'

export function getModelPage (query) {
  return request({
    url: '/bpm/model/page',
    method: 'get',
    params: query
  })
}

export function getModel (id) {
  return request({
    url: '/bpm/model/get?id=' + id,
    method: 'get'
  })
}

export function updateModel (data) {
  return request({
    url: '/bpm/model/update',
    method: 'PUT',
    data: data
  })
}

// 任务状态修改
export function updateModelState (id, state) {
  return request({
    url: '/bpm/model/update-state',
    method: 'put',
    data: {
      id,
      state
    }
  })
}

export function createModel (data) {
  return request({
    url: '/bpm/model/create',
    method: 'POST',
    data: data
  })
}

export function deleteModel (id) {
  return request({
    url: '/bpm/model/delete?id=' + id,
    method: 'DELETE'
  })
}

export function deployModel (id) {
  return request({
    url: '/bpm/model/deploy?id=' + id,
    method: 'POST'
  })
}

export function getBpmFlowTree (param) {
  return request({
    url: '/bpm/config/getBpmFlowTree',
    method: 'GET',
    params: param
  })
}
export function getListByType () {
  return request({
    url: '/system/dict-data/listByType?type=bpm_config_operate_type',
    method: 'GET'
  })
}

export function getBpmByType (data) {
  return request({
    url: '/bpm/config/getBpmByType?operateType=' + data,
    method: 'GET'
  })
}

export function handleButtonCreate (param) {
  return request({
    url: '/bpm/config/create',
    method: 'POST',
    data: param
  })
}
export function handleButtonUpdate (param) {
  return request({
    url: '/bpm/config/update',
    method: 'POST',
    data: param
  })
}

export function handleButtonDelete (param) {
  return request({
    url: '/bpm/config/delete',
    method: 'GET',
    params: param
  })
}

// 任务分配规则导出
export function handleDownLoadTask (param) {
  return request({
    url: '/bpm/task-assign-rule/export',
    method: 'GET',
    params: param,
    responseType: 'blob'
  })
}


// 导出流程配置
export function handleDownLoadProcess (param) {
  return request({
    url: '/bpm/config/export-excel',
    method: 'GET',
    params: param,
    responseType: 'blob'
  })
}


// 导入流程配置
export function handleImportProcess (param) {
  return request({
    url: '/bpm/model/synBpm',
    method: 'POST',
    data: param,
  })
}


