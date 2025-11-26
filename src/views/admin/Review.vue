<template>
    <div class="review-management">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>审核管理</span>
                </div>
            </template>

            <div class="content-placeholder">
                <el-icon :size="80" color="#ccc"><View /></el-icon>
                <p>审核管理功能开发中...</p>
            </div>
        </el-card>
    </div>
</template>

<script setup>
    import { View } from '@element-plus/icons-vue'
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
