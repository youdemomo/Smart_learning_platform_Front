<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>管理后台</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <!-- 用户管理 - 二级菜单 -->
          <el-sub-menu index="users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users-students">
              <span>学生用户管理</span>
            </el-menu-item>
            <el-menu-item index="users-institutions">
              <span>机构用户管理</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="announcements">
            <el-icon><Bell /></el-icon>
            <span>公告管理</span>
          </el-menu-item>
          <el-menu-item index="help">
            <el-icon><Document /></el-icon>
            <span>帮助文档</span>
          </el-menu-item>
          <el-menu-item index="review">
            <el-icon><View /></el-icon>
            <span>审核管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部栏 -->
        <el-header class="header">
          <div class="header-content">
            <div class="header-left">
              <span class="page-title">{{ pageTitle }}</span>
            </div>
            <div class="header-right">
              <el-dropdown @command="handleCommand">
                <span class="user-info">
                  <el-avatar :size="32" :icon="UserFilled" />
                  <span class="username">{{ authStore.user?.username }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile"
                      >个人信息</el-dropdown-item
                    >
                    <el-dropdown-item command="home">返回前台</el-dropdown-item>
                    <el-dropdown-item command="logout" divided
                      >退出登录</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  DataAnalysis,
  User,
  Bell,
  Document,
  View,
  UserFilled,
  ArrowDown,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeMenu = ref("dashboard");

const pageTitle = computed(() => {
  const titles = {
    dashboard: "数据统计",
    "users-students": "学生用户管理",
    "users-institutions": "机构用户管理",
    announcements: "公告管理",
    help: "帮助文档",
    review: "审核管理",
  };
  return titles[activeMenu.value] || "管理后台";
});

const handleMenuSelect = (index) => {
  activeMenu.value = index;
  router.push(`/admin/${index}`);
};

const handleCommand = (command) => {
  if (command === "logout") {
    ElMessageBox.confirm("确定要退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        authStore.logout();
        ElMessage.success("已退出登录");
        router.push("/login");
      })
      .catch(() => {});
  } else if (command === "profile") {
    ElMessage.info("个人信息功能开发中...");
  } else if (command === "home") {
    router.push("/home");
  }
};
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

/* 侧边栏样式 */
.sidebar {
  background-color: #304156;
  color: white;
  overflow-y: auto;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  height: 50px;
  line-height: 50px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #263445;
  color: #409eff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff !important;
  color: white;
}

.sidebar-menu .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 二级菜单样式 */
.sidebar-menu :deep(.el-sub-menu__title) {
  color: #bfcbd9 !important;
  height: 50px;
  line-height: 50px;
}

.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
  color: #409eff !important;
}

.sidebar-menu :deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #409eff !important;
}

.sidebar-menu :deep(.el-menu) {
  background-color: #1f2d3d !important;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #bfcbd9 !important;
  background-color: #1f2d3d !important;
  min-width: 200px;
  padding-left: 50px !important;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: #001528 !important;
  color: white !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
  color: white !important;
}

/* 顶部栏样式 */
.header {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0;
  height: 60px;
}

.header-content {
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
}

/* 主内容区样式 */
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
