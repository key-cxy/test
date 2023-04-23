import request from '@/utils/request'
import { getSystem } from "@/utils/auth";

// // 获取路由
// export const getRouters = () => {
//   const params ={
//     system: getSystem()
//   }
//   return request({
//     url: '/system/auth/list-menus',
//     method: 'get',
//     params: params
//   })
// }// 获取路由
export const getRouters = (value='149') => {
  const params ={
    system: getSystem(),
    subsystemId:'149'
  }
  console.log('getRouters-params',params)
  return request({
    url: '/system/auth/list-menus-subsystemId',
    method: 'get',
    params: params
  })
}


