import request from '@/utils/request'

export function getTaskAssignRuleList(query) {
  return request({
    url: '/bpm/task-assign-rule/list',
    method: 'get',
    params: query
  })
}

export function createTaskAssignRule(data) {
  return request({
    url: '/bpm/task-assign-rule/create',
    method: 'post',
    data: data
  })
}

export function updateTaskAssignRule(data) {
  return request({
    url: '/bpm/task-assign-rule/update',
    method: 'put',
    data: data
  })
}

export function getAssignType() {
  return request({
    url: '/system/dict-data/listByType?type=bpm_assign_type',
    method: 'GET'
  })
}
