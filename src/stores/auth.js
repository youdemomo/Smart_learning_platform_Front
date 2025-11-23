import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)

  // 登录
  async function loginUser(credentials) {
    const response = await login(credentials)
    if (response.code === 200) {
      token.value = response.data.token
      user.value = {
        id: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        emailVerified: response.data.emailVerified
      }
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return response
    }
    throw new Error(response.message)
  }

  // 注册
  async function registerUser(userData) {
    const response = await register(userData)
    if (response.code === 200) {
      token.value = response.data.token
      user.value = {
        id: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        emailVerified: response.data.emailVerified
      }
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return response
    }
    throw new Error(response.message)
  }

  // 登出
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    loginUser,
    registerUser,
    logout
  }
})
