import request from './request'

/**
 * 认证相关API
 */

// 用户登录
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 发送验证码
export const sendCode = (email) => {
  return request({
    url: '/auth/send-code',
    method: 'post',
    data: { email }
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 验证邮箱
 */
export function verifyEmail(email, code) {
  return request({
    url: '/auth/verify-email',
    method: 'get',
    params: { email, code }
  })
}

/**
 * 重新发送验证邮件
 */
export function resendVerification(email) {
  return request({
    url: '/auth/resend-verification',
    method: 'post',
    params: { email }
  })
}
