import request from '@/utils/requestJQFX'

export function getList() {
    return request({
        url: '/api/test/get',
        method: 'get'
    })
}