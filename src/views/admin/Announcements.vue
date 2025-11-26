<template>
    <div class="announcements-management">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>公告管理</span>
                </div>
            </template>

            <div class="content-placeholder">
                <el-icon :size="80" color="#ccc"><Bell /></el-icon>
                <p>公告管理功能开发中...</p>
            </div>
        </el-card>
    </div>
</template>

<script setup>
    import { Bell } from '@element-plus/icons-vue'
</script>

<style scoped>
    .content-placeholder {
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
    }

    .content-placeholder p {
        margin-top: 20px;
        font-size: 16px;
    }
</style>
