<template>
    <div class="announcements-management">
        <!-- 公告管理 -->
        <el-card style="margin-bottom: 20px">
            <template #header>
                <div class="card-header">
                    <span>群发消息</span>
                    <el-button type="primary" @click="handleShowBroadcastDialog">
                        <el-icon><Message /></el-icon>
                        发送群发消息
                    </el-button>
                </div>
            </template>

            <div class="broadcast-info">
                <el-alert title="群发消息说明" type="info" :closable="false" show-icon>
                    <template #default>
                        <p>管理员可以向所有学员、所有机构或所有用户发送群发消息。</p>
                        <p>消息将发送到用户的消息中心，用户可以在消息中心查看。</p>
                    </template>
                </el-alert>
            </div>
        </el-card>

        <!-- 轮播图管理 -->
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>轮播图管理</span>
                    <el-button type="primary" @click="handleAddBanner">
                        <el-icon><Plus /></el-icon>
                        添加轮播图
                    </el-button>
                </div>
            </template>

            <!-- 轮播图列表 -->
            <el-table :data="banners" v-loading="loading" stripe>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column label="预览" width="200">
                    <template #default="{ row }">
                        <el-image :src="row.image" style="width: 180px; height: 100px" fit="cover" :preview-src-list="[row.image]" preview-teleported>
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="150" />
                <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
                <el-table-column prop="link" label="跳转链接" min-width="150" show-overflow-tooltip />
                <el-table-column prop="buttonText" label="按钮文字" width="120" />
                <el-table-column prop="sortOrder" label="排序" width="80" sortable />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.enabled ? 'success' : 'info'">
                            {{ row.enabled ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleEditBanner(row)"> 编辑 </el-button>
                        <el-button type="danger" link size="small" @click="handleDeleteBanner(row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加/编辑轮播图对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :close-on-click-modal="false">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="图片" prop="image">
                    <div class="image-upload">
                        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeImageUpload" :http-request="handleImageUpload">
                            <el-image v-if="form.image" :src="form.image" class="avatar" fit="cover" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                            <el-progress :percentage="uploadProgress" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="跳转链接" prop="link">
                    <el-input v-model="form.link" placeholder="请输入跳转链接（可选）" />
                </el-form-item>
                <el-form-item label="按钮文字" prop="buttonText">
                    <el-input v-model="form.buttonText" placeholder="请输入按钮文字（可选）" />
                </el-form-item>
                <el-form-item label="排序号" prop="sortOrder">
                    <el-input-number v-model="form.sortOrder" :min="0" :max="999" />
                    <span style="margin-left: 10px; color: #999; font-size: 12px"> 数字越小越靠前 </span>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-switch v-model="form.enabled" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
            </template>
        </el-dialog>

        <!-- 群发消息对话框 -->
        <el-dialog v-model="broadcastDialogVisible" title="发送群发消息" width="700px" :close-on-click-modal="false">
            <el-form ref="broadcastFormRef" :model="broadcastForm" :rules="broadcastRules" label-width="120px">
                <el-form-item label="发送对象" prop="targetRole">
                    <el-radio-group v-model="broadcastForm.targetRole">
                        <el-radio label="ALL">所有用户（学员+机构）</el-radio>
                        <el-radio label="STUDENT">所有学员</el-radio>
                        <el-radio label="INSTITUTION">所有机构</el-radio>
                    </el-radio-group>
                    <div class="form-tip">
                        {{ getTargetRoleDescription(broadcastForm.targetRole) }}
                    </div>
                </el-form-item>
                <el-form-item label="消息标题" prop="title">
                    <el-input v-model="broadcastForm.title" placeholder="请输入消息标题" maxlength="200" show-word-limit />
                </el-form-item>
                <el-form-item label="消息内容" prop="content">
                    <el-input v-model="broadcastForm.content" type="textarea" :rows="8" placeholder="请输入消息内容" maxlength="5000" show-word-limit />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="broadcastDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleBroadcastSubmit" :loading="broadcasting"> 发送 </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Bell, Plus, Picture, Message } from '@element-plus/icons-vue'
    import { getAllBanners, createBanner, updateBanner, deleteBanner } from '@/api/banner'
    import { uploadImage } from '@/api/upload'
    import { broadcastMessage } from '@/api/message'
    import { useAuthStore } from '@/stores/auth'

    const authStore = useAuthStore()

    // 数据
    const loading = ref(false)
    const banners = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('添加轮播图')
    const submitting = ref(false)
    const uploadProgress = ref(0)

    // 群发消息相关
    const broadcastDialogVisible = ref(false)
    const broadcasting = ref(false)
    const broadcastFormRef = ref(null)
    const broadcastForm = ref({
        targetRole: 'ALL',
        title: '',
        content: '',
    })

    const broadcastRules = {
        targetRole: [{ required: true, message: '请选择发送对象', trigger: 'change' }],
        title: [
            { required: true, message: '请输入消息标题', trigger: 'blur' },
            { max: 200, message: '消息标题不能超过200个字符', trigger: 'blur' },
        ],
        content: [
            { required: true, message: '请输入消息内容', trigger: 'blur' },
            { max: 5000, message: '消息内容不能超过5000个字符', trigger: 'blur' },
        ],
    }

    // 表单
    const formRef = ref(null)
    const form = ref({
        id: null,
        title: '',
        description: '',
        image: '',
        link: '',
        buttonText: '',
        sortOrder: 0,
        enabled: true,
    })

    // 表单验证规则
    const rules = {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        image: [{ required: true, message: '请上传图片', trigger: 'change' }],
    }

    // 加载轮播图列表
    const loadBanners = async () => {
        loading.value = true
        try {
            const response = await getAllBanners()
            if (response.code === 200) {
                banners.value = response.data || []
            }
        } catch (error) {
            ElMessage.error('加载轮播图失败')
        } finally {
            loading.value = false
        }
    }

    // 添加轮播图
    const handleAddBanner = () => {
        dialogTitle.value = '添加轮播图'
        form.value = {
            id: null,
            title: '',
            description: '',
            image: '',
            link: '',
            buttonText: '',
            sortOrder: banners.value.length > 0 ? Math.max(...banners.value.map((b) => b.sortOrder || 0)) + 1 : 0,
            enabled: true,
        }
        uploadProgress.value = 0
        dialogVisible.value = true
    }

    // 编辑轮播图
    const handleEditBanner = (row) => {
        dialogTitle.value = '编辑轮播图'
        form.value = {
            id: row.id,
            title: row.title,
            description: row.description || '',
            image: row.image,
            link: row.link || '',
            buttonText: row.buttonText || '',
            sortOrder: row.sortOrder || 0,
            enabled: row.enabled,
        }
        uploadProgress.value = 0
        dialogVisible.value = true
    }

    // 删除轮播图
    const handleDeleteBanner = (row) => {
        ElMessageBox.confirm(`确定要删除轮播图"${row.title}"吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(async () => {
                try {
                    const response = await deleteBanner(row.id)
                    if (response.code === 200) {
                        ElMessage.success('删除成功')
                        loadBanners()
                    } else {
                        ElMessage.error(response.message || '删除失败')
                    }
                } catch (error) {
                    ElMessage.error('删除失败')
                }
            })
            .catch(() => {})
    }

    // 提交表单
    const handleSubmit = async () => {
        if (!formRef.value) return

        formRef.value.validate(async (valid) => {
            if (!valid) return

            submitting.value = true
            try {
                const data = {
                    title: form.value.title,
                    description: form.value.description,
                    image: form.value.image,
                    link: form.value.link,
                    buttonText: form.value.buttonText,
                    sortOrder: form.value.sortOrder,
                    enabled: form.value.enabled,
                }

                let response
                if (form.value.id) {
                    // 更新
                    response = await updateBanner(form.value.id, data)
                } else {
                    // 创建
                    response = await createBanner(data)
                }

                if (response.code === 200) {
                    ElMessage.success(form.value.id ? '更新成功' : '创建成功')
                    dialogVisible.value = false
                    loadBanners()
                } else {
                    ElMessage.error(response.message || '操作失败')
                }
            } catch (error) {
                ElMessage.error('操作失败')
            } finally {
                submitting.value = false
            }
        })
    }

    // 图片上传前验证
    const beforeImageUpload = (file) => {
        const isImage = file.type.startsWith('image/')
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isImage) {
            ElMessage.error('只能上传图片文件!')
            return false
        }
        if (!isLt5M) {
            ElMessage.error('图片大小不能超过 5MB!')
            return false
        }
        return true
    }

    // 图片上传
    const handleImageUpload = async (options) => {
        const file = options.file
        uploadProgress.value = 1

        try {
            const response = await uploadImage(file, (progress) => {
                uploadProgress.value = progress
            })

            if (response.code === 200 && response.data) {
                form.value.image = response.data.fileUrl
                uploadProgress.value = 0
                ElMessage.success('图片上传成功')
            } else {
                ElMessage.error(response.message || '图片上传失败')
                uploadProgress.value = 0
            }
        } catch (error) {
            ElMessage.error('图片上传失败')
            uploadProgress.value = 0
        }
    }

    // 显示群发消息对话框
    const handleShowBroadcastDialog = () => {
        broadcastForm.value = {
            targetRole: 'ALL',
            title: '',
            content: '',
        }
        broadcastDialogVisible.value = true
    }

    // 获取目标角色描述
    const getTargetRoleDescription = (role) => {
        const descriptions = {
            ALL: '将发送给所有学员和机构用户',
            STUDENT: '将发送给所有学员用户',
            INSTITUTION: '将发送给所有机构用户',
        }
        return descriptions[role] || ''
    }

    // 提交群发消息
    const handleBroadcastSubmit = async () => {
        if (!broadcastFormRef.value) return

        broadcastFormRef.value.validate(async (valid) => {
            if (!valid) return

            broadcasting.value = true
            try {
                const response = await broadcastMessage({
                    targetRole: broadcastForm.value.targetRole,
                    title: broadcastForm.value.title,
                    content: broadcastForm.value.content,
                })

                if (response.code === 200) {
                    ElMessage.success(response.message || '群发消息发送成功')
                    broadcastDialogVisible.value = false
                    broadcastFormRef.value.resetFields()
                } else {
                    ElMessage.error(response.message || '发送失败')
                }
            } catch (error) {
                console.error('群发消息失败:', error)
                ElMessage.error(error.message || '发送失败，请稍后重试')
            } finally {
                broadcasting.value = false
            }
        })
    }

    // 初始化
    onMounted(() => {
        loadBanners()
    })
</script>

<style scoped>
    .announcements-management {
        padding: 0;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .broadcast-info {
        padding: 20px 0;
    }

    .broadcast-info :deep(.el-alert__content) {
        line-height: 1.8;
    }

    .broadcast-info p {
        margin: 5px 0;
    }

    .form-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 5px;
    }

    .image-upload {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .avatar-uploader {
        width: 180px;
        height: 100px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;
    }

    .avatar-uploader:hover {
        border-color: #409eff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }

    .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
    }

    .upload-progress {
        width: 180px;
    }
</style>
