import request from "@/utils/request";
import { getSystem } from "@/utils/auth";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  return request({
    url: "/system/auth/login",
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  const params = {
    system: getSystem(),
  };
  return request({
    url: "/system/auth/get-permission-info",
    method: "get",
    params: params,
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/system/auth/casLogout",
    method: "get",
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/system/captcha/get-image",
    method: "get",
    timeout: 20000,
  });
}

// 社交授权的跳转
export function socialAuthRedirect(type, redirectUri) {
  return request({
    url:
      "/system/auth/social-auth-redirect?type=" +
      type +
      "&redirectUri=" +
      redirectUri,
    method: "get",
  });
}

// 社交快捷登录，使用 code 授权码
export function socialQuickLogin(type, code, state) {
  return request({
    url: "/system/auth/social-quick-login",
    method: "post",
    data: {
      type,
      code,
      state,
    },
  });
}

// 社交绑定登录，使用 code 授权码 + + 账号密码
export function socialBindLogin(type, code, state, username, password) {
  return request({
    url: "/system/auth/social-bind-login",
    method: "post",
    data: {
      type,
      code,
      state,
      username,
      password,
    },
  });
}

// 获取登录验证码
export function sendSmsCode(mobile, scene) {
  return request({
    url: "/system/auth/send-sms-code",
    method: "post",
    data: {
      mobile,
      scene,
    },
  });
}

// 短信验证码登录
export function smsLogin(mobile, code) {
  return request({
    url: "/system/auth/sms-login",
    method: "post",
    data: {
      mobile,
      code,
    },
  });
}

// 获取用户的部门等级等信息
export function getCurrentUser() {
  return request({
    url: "/system/user/getCurrentUser",
    method: "get",
    timeout: 20000,
  });
}
