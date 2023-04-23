import request from '@/utils/request'
import { getSystem } from "@/utils/auth";

// 获取后台token
export const getToken = () => {
  return request({
    url: '/system/auth/login/ssologin',
  })
}

  