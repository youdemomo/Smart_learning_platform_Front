import request from './request'

/**
 * 用户管理API
 */

// 获取用户列表（分页）
export const getUserList = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export const getUserById = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 更新用户信息
export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

// 封禁用户
export const banUser = (id) => {
  return request({
    url: `/users/${id}/ban`,
    method: 'put'
  })
}

// 解封用户
export const unbanUser = (id) => {
  return request({
    url: `/users/${id}/unban`,
    method: 'put'
  })
}

// 创建用户
export const createUser = (data, role) => {
  return request({
    url: '/users',
    method: 'post',
    params: { role },
    data
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
