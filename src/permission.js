import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken } from "@/utils/auth";
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

// 增加三方登陆 update by 芋艿
const whiteList = ['/login', '/social-login', '/auth-redirect', '/bind', '/register', '/oauthLogin/gitee']

router.beforeEach((to, from, next) => {
  if (to.query.token) {
    setToken(to.query.token)
  }
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/comys' })
      console.log('1234')
      // window.open(process.env.VUE_APP_DJLD_API+'/admin-api/system/auth/login/ssologin','_self');
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true
        // 获取字典数据 add by 芋艿
        store.dispatch('dict/loadDictDatas')
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          store.dispatch('LogOut').then(res => {
            Message.error(err)
            next({ path: '/comys' })
            console.log('4321', res)
            // window.open(res, '_self');
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      window.open(process.env.VUE_APP_DJLD_API + '/cas/login?service=' + process.env.VUE_APP_BASE_API + '/admin-api/system/auth/login/ssologin', '_self');
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
