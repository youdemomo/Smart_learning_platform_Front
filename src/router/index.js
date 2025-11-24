import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: false }
    },
    // 机构工作台路由
    {
      path: '/institution/workspace',
      name: 'InstitutionWorkspace',
      component: () => import('@/views/institution/InstitutionWorkspace.vue'),
      meta: { requiresAuth: true, requiresInstitution: true }
    },
    // 管理员路由
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'users-students',
          name: 'AdminUsersStudents',
          component: () => import('@/views/admin/UsersStudents.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'users-institutions',
          name: 'AdminUsersInstitutions',
          component: () => import('@/views/admin/UsersInstitutions.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'announcements',
          name: 'AdminAnnouncements',
          component: () => import('@/views/admin/Announcements.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'help',
          name: 'AdminHelp',
          component: () => import('@/views/admin/Help.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'review',
          name: 'AdminReview',
          component: () => import('@/views/admin/Review.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && authStore.userRole !== 'ADMIN') {
    next('/home')
    return
  }
  
  // 检查是否需要机构权限
  if (to.meta.requiresInstitution && authStore.userRole !== 'INSTITUTION') {
    next('/home')
    return
  }
  
  next()
})

export default router
