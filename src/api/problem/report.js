import requestDJLD from '@/utils/requestDJLD'
import request1 from '@/utils/request'

// 获取问题类型下拉列表
export function handleGetList (data) {
  return request1({
    url: '/system/dict-data/getDictionary',
    method: 'post',
    data
  })
}

// 获取问题类型下拉列表
export function handleSubmit(data) {
  return requestDJLD({
    url: '/app/saveData',
    method: 'post',
    data
  })
}
