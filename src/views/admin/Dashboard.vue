<template>
    <div class="dashboard">
        <el-row :gutter="20" class="stats-row">
            <!-- 用户统计 -->
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" style="background-color: #409eff">
                            <el-icon :size="30"><User /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">1,234</div>
                            <div class="stat-label">总用户数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 课程统计 -->
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" style="background-color: #67c23a">
                            <el-icon :size="30"><Reading /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">567</div>
                            <div class="stat-label">课程总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 培训机构统计 -->
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" style="background-color: #e6a23c">
                            <el-icon :size="30"><OfficeBuilding /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">89</div>
                            <div class="stat-label">培训机构</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 待审核统计 -->
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon" style="background-color: #f56c6c">
                            <el-icon :size="30"><Warning /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">12</div>
                            <div class="stat-label">待审核</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="20" class="charts-row">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>用户增长趋势</span>
                        </div>
                    </template>
                    <div class="chart-placeholder">
                        <el-icon :size="60" color="#ccc"><TrendCharts /></el-icon>
                        <p>图表占位符 - 用户增长趋势图</p>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>课程分类统计</span>
                        </div>
                    </template>
                    <div class="chart-placeholder">
                        <el-icon :size="60" color="#ccc"><PieChart /></el-icon>
                        <p>图表占位符 - 课程分类饼图</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 数据表格 -->
        <el-row :gutter="20" class="table-row">
            <el-col :span="24">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>最新用户注册</span>
                            <el-button type="primary" size="small">查看更多</el-button>
                        </div>
                    </template>
                    <el-table :data="recentUsers" style="width: 100%">
                        <el-table-column prop="id" label="ID" width="80" />
                        <el-table-column prop="username" label="用户名" width="150" />
                        <el-table-column prop="email" label="邮箱" width="200" />
                        <el-table-column prop="role" label="角色" width="120">
                            <template #default="{ row }">
                                <el-tag v-if="row.role === 'STUDENT'" type="success">学生</el-tag>
                                <el-tag v-else-if="row.role === 'INSTITUTION'" type="warning">培训机构</el-tag>
                                <el-tag v-else type="info">其他</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdAt" label="注册时间" width="180" />
                        <el-table-column label="状态" width="100">
                            <template #default="{ row }">
                                <el-tag v-if="row.verified" type="success" size="small">已验证</el-tag>
                                <el-tag v-else type="warning" size="small">未验证</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default>
                                <el-button type="primary" size="small" link>查看</el-button>
                                <el-button type="danger" size="small" link>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { User, Reading, OfficeBuilding, Warning, TrendCharts, PieChart } from '@element-plus/icons-vue'

    // 模拟数据
    const recentUsers = ref([
        {
            id: 1,
            username: 'student01',
            email: 'student01@example.com',
            role: 'STUDENT',
            createdAt: '2025-11-26 10:30:00',
            verified: true,
        },
        {
            id: 2,
            username: 'institution01',
            email: 'institution01@example.com',
            role: 'INSTITUTION',
            createdAt: '2025-11-26 09:15:00',
            verified: false,
        },
        {
            id: 3,
            username: 'student02',
            email: 'student02@example.com',
            role: 'STUDENT',
            createdAt: '2025-11-25 16:45:00',
            verified: true,
        },
        {
            id: 4,
            username: 'student03',
            email: 'student03@example.com',
            role: 'STUDENT',
            createdAt: '2025-11-25 14:20:00',
            verified: true,
        },
        {
            id: 5,
            username: 'institution02',
            email: 'institution02@example.com',
            role: 'INSTITUTION',
            createdAt: '2025-11-25 11:00:00',
            verified: false,
        },
    ])
</script>

<style scoped>
    .dashboard {
        padding: 0;
    }

    /* 统计卡片行 */
    .stats-row {
        margin-bottom: 20px;
    }

    .stat-card {
        cursor: pointer;
        transition: all 0.3s;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .stat-info {
        flex: 1;
    }

    .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 14px;
        color: #999;
    }

    /* 图表行 */
    .charts-row {
        margin-bottom: 20px;
    }

    .chart-placeholder {
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
    }

    .chart-placeholder p {
        margin-top: 10px;
        font-size: 14px;
    }

    /* 表格行 */
    .table-row {
        margin-bottom: 20px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
    }
</style>
