<template>
    <div class="home-container">
        <el-container>
            <el-header class="header">
                <div class="header-content">
                    <!-- Logo -->
                    <div class="logo">
                        <h1>智慧学习平台</h1>
                    </div>

                    <!-- 导航菜单 -->
                    <el-menu :default-active="activeMenu" class="nav-menu" mode="horizontal" @select="handleMenuSelect">
                        <el-menu-item index="home">首页</el-menu-item>
                        <el-menu-item index="courseware">课件</el-menu-item>
                        <el-menu-item index="courses">课程</el-menu-item>
                        <el-menu-item index="postgraduate">升学考研</el-menu-item>
                    </el-menu>

                    <!-- 右侧操作区 -->
                    <div class="header-actions">
                        <!-- 搜索框 -->
                        <el-input v-model="searchKeyword" placeholder="搜索课程、课件..." class="search-input" :prefix-icon="Search" clearable @keyup.enter="handleSearch" />

                        <!-- 用户信息或登录注册按钮 -->
                        <template v-if="authStore.isAuthenticated">
                            <el-dropdown @command="handleCommand">
                                <span class="user-info">
                                    <el-avatar :size="32" :icon="UserFilled" />
                                    <span class="username">{{ authStore.user?.username }}</span>
                                    <el-icon><ArrowDown /></el-icon>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                                        <el-dropdown-item v-if="authStore.userRole === 'INSTITUTION'" command="workspace"> 机构工作台 </el-dropdown-item>
                                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                        <template v-else>
                            <el-button type="primary" @click="router.push('/login')">登录</el-button>
                            <el-button @click="router.push('/register')">注册</el-button>
                        </template>
                    </div>
                </div>
            </el-header>

            <el-main class="main">
                <div class="welcome-section">
                    <h2>欢迎来到智慧学习平台</h2>
                    <p v-if="authStore.isAuthenticated">
                        您好，{{ authStore.user?.username }}！
                        <span v-if="!authStore.user?.emailVerified" class="warning-text"> （您的邮箱尚未验证，请查收验证邮件） </span>
                    </p>
                    <p v-else>请登录以获得完整的学习体验</p>

                    <div v-if="authStore.isAuthenticated" class="user-role-info">
                        <el-tag v-if="authStore.userRole === 'STUDENT'" type="success" size="large"> 学生用户 </el-tag>
                        <el-tag v-else-if="authStore.userRole === 'INSTITUTION'" type="warning" size="large"> 培训机构 </el-tag>
                        <el-tag v-else-if="authStore.userRole === 'ADMIN'" type="danger" size="large"> 管理员 </el-tag>
                    </div>
                </div>

                <div class="features-section">
                    <h3>平台功能</h3>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-card shadow="hover" class="feature-card">
                                <template #header>
                                    <div class="card-header">
                                        <el-icon :size="30" color="#409EFF"><Reading /></el-icon>
                                        <span>课程学习</span>
                                    </div>
                                </template>
                                <p>丰富的在线课程资源，支持视频学习和资料下载</p>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="hover" class="feature-card">
                                <template #header>
                                    <div class="card-header">
                                        <el-icon :size="30" color="#67C23A"><Edit /></el-icon>
                                        <span>学习任务</span>
                                    </div>
                                </template>
                                <p>完成课程任务，获得老师批改和反馈</p>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="hover" class="feature-card">
                                <template #header>
                                    <div class="card-header">
                                        <el-icon :size="30" color="#E6A23C"><ChatDotRound /></el-icon>
                                        <span>互动评价</span>
                                    </div>
                                </template>
                                <p>课程评价和讨论，与其他学习者交流</p>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { UserFilled, ArrowDown, Reading, Edit, ChatDotRound, Search } from '@element-plus/icons-vue'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const authStore = useAuthStore()

    // 导航菜单状态
    const activeMenu = ref('home')
    const searchKeyword = ref('')

    // 处理菜单选择
    const handleMenuSelect = (index) => {
        activeMenu.value = index

        switch (index) {
            case 'home':
                ElMessage.info('当前在首页')
                break
            case 'courseware':
                ElMessage.info('课件功能开发中...')
                break
            case 'courses':
                ElMessage.info('课程功能开发中...')
                break
            case 'postgraduate':
                ElMessage.info('升学考研功能开发中...')
                break
        }
    }

    // 处理搜索
    const handleSearch = () => {
        if (searchKeyword.value.trim()) {
            ElMessage.success(`搜索: ${searchKeyword.value}`)
            // TODO: 实现搜索功能
        } else {
            ElMessage.warning('请输入搜索关键词')
        }
    }

    // 处理用户下拉菜单
    const handleCommand = (command) => {
        if (command === 'logout') {
            ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    authStore.logout()
                    ElMessage.success('已退出登录')
                    router.push('/login')
                })
                .catch(() => {})
        } else if (command === 'profile') {
            ElMessage.info('个人信息功能开发中...')
        } else if (command === 'workspace') {
            router.push('/institution/workspace')
        }
    }
</script>

<style scoped>
    .home-container {
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .header {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 0;
        height: 60px;
        line-height: 60px;
    }

    .header-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
    }

    /* Logo 样式 */
    .logo h1 {
        font-size: 20px;
        color: #409eff;
        margin: 0;
        font-weight: bold;
        white-space: nowrap;
    }

    /* 导航菜单样式 */
    .nav-menu {
        flex: 1;
        display: flex;
        justify-content: center;
        border-bottom: none;
        background: transparent;
        margin: 0 40px;
    }

    .nav-menu .el-menu-item {
        font-size: 15px;
        font-weight: 500;
        padding: 0 20px;
        height: 60px;
        line-height: 60px;
    }

    .nav-menu .el-menu-item:hover {
        background-color: #f5f7fa;
    }

    /* 右侧操作区 */
    .header-actions {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    /* 搜索框样式 */
    .search-input {
        width: 240px;
    }

    .search-input :deep(.el-input__wrapper) {
        border-radius: 20px;
    }

    /* 用户信息样式 */
    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 20px;
        transition: all 0.3s;
        background-color: #f5f7fa;
    }

    .user-info:hover {
        background-color: #e8eaf0;
    }

    .username {
        font-size: 14px;
        color: #333;
        font-weight: 500;
    }

    .main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .welcome-section {
        text-align: center;
        margin-bottom: 60px;
    }

    .welcome-section h2 {
        font-size: 36px;
        color: #333;
        margin-bottom: 20px;
    }

    .welcome-section p {
        font-size: 18px;
        color: #666;
        margin-bottom: 20px;
    }

    .warning-text {
        color: #e6a23c;
        font-size: 14px;
    }

    .user-role-info {
        margin-top: 20px;
    }

    .features-section {
        margin-top: 40px;
    }

    .features-section h3 {
        font-size: 24px;
        color: #333;
        margin-bottom: 30px;
        text-align: center;
    }

    .feature-card {
        height: 100%;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: bold;
    }

    .feature-card p {
        color: #666;
        line-height: 1.6;
    }
</style>
