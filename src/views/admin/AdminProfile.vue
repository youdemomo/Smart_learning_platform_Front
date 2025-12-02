<template>
  <div class="admin-profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>

      <div class="profile-content">
        <!-- 左侧头像区域 -->
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
            accept="image/*"
          >
            <el-avatar 
              v-if="userInfo.avatar" 
              :src="userInfo.avatar" 
              :size="120"
              class="avatar"
            />
            <el-avatar 
              v-else 
              :size="120" 
              :icon="UserFilled"
              class="avatar"
            />
            <div class="avatar-mask">
              <el-icon :size="24"><Camera /></el-icon>
              <div>更换头像</div>
            </div>
          </el-upload>
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
            <el-progress :percentage="uploadProgress" :stroke-width="6" />
          </div>
        </div>

        <!-- 右侧表单区域 -->
        <div class="form-section">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            label-position="left"
          >
            <!-- 用户名（不可修改） -->
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="profileForm.username"
                placeholder="请输入用户名"
                disabled
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <!-- 邮箱（不可修改） -->
            <el-form-item label="邮箱">
              <el-input
                v-model="profileForm.email"
                disabled
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
                <template #suffix>
                  <el-tag v-if="userInfo.emailVerified" size="small" type="success">已验证</el-tag>
                  <el-tag v-else size="small" type="warning">未验证</el-tag>
                </template>
              </el-input>
            </el-form-item>

            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="profileForm.phone"
                placeholder="请输入联系电话"
                :disabled="!isEditing"
              >
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <!-- 地址 -->
            <el-form-item label="地址" prop="address">
              <el-input
                v-model="profileForm.address"
                placeholder="请输入地址"
                :disabled="!isEditing"
              >
                <template #prefix>
                  <el-icon><Location /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <!-- 角色信息 -->
            <el-form-item label="角色">
              <el-tag type="danger">管理员</el-tag>
            </el-form-item>

            <!-- 注册时间 -->
            <el-form-item label="注册时间">
              <span>{{ formatDate(userInfo.createdAt) }}</span>
            </el-form-item>
          </el-form>

          <div class="form-actions">
            <el-button 
              v-if="!isEditing" 
              type="primary" 
              @click="isEditing = true"
              :icon="Edit"
            >
              编辑资料
            </el-button>
            <div v-else class="action-buttons">
              <el-button @click="cancelEdit">取消</el-button>
              <el-button 
                type="primary" 
                @click="handleSaveProfile" 
                :loading="saving"
                :icon="Check"
              >
                保存修改
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 账号安全 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span class="card-title">账号安全</span>
        </div>
      </template>

      <div class="security-items">
        <div class="security-item">
          <div class="security-info">
            <el-icon :size="24" color="#409EFF"><Lock /></el-icon>
            <div class="security-text">
              <div class="security-title">登录密码</div>
              <div class="security-desc">定期更换密码可以保护账号安全</div>
            </div>
          </div>
          <el-button type="primary" link @click="openPasswordDialog">修改密码</el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <el-icon :size="24" color="#67C23A"><Message /></el-icon>
            <div class="security-text">
              <div class="security-title">邮箱验证</div>
              <div class="security-desc">
                {{ userInfo.emailVerified ? '您的邮箱已验证' : '请尽快完成邮箱验证' }}
              </div>
            </div>
          </div>
          <el-tag v-if="userInfo.emailVerified" type="success">已验证</el-tag>
          <el-button v-else type="warning" link disabled>去验证</el-button>
        </div>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePasswordDialog">取消</el-button>
          <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  UserFilled,
  Camera,
  Message,
  Edit,
  Check,
  User,
  Phone,
  Location,
  Lock
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { getUserById, updateUser, changePassword } from '@/api/user'
import { uploadImage } from '@/api/upload'

const router = useRouter()
const authStore = useAuthStore()
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
  avatar: '',
  role: '',
  address: '',
  phone: '',
  emailVerified: false,
  createdAt: ''
})

// 表单数据
const profileForm = ref({
  username: '',
  email: '',
  avatar: '',
  address: '',
  phone: ''
})

// 编辑状态
const isEditing = ref(false)
const saving = ref(false)
const uploadProgress = ref(0)

// 表单验证规则
const profileRules = {
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 修改密码相关
const passwordDialogVisible = ref(false)
const changingPassword = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await getUserById(authStore.user.id)
    if (response.code === 200 && response.data) {
      userInfo.value = response.data
      profileForm.value = {
        username: response.data.username || '',
        email: response.data.email || '',
        avatar: response.data.avatar || '',
        address: response.data.address || '',
        phone: response.data.phone || ''
      }
    } else {
      ElMessage.error('加载用户信息失败')
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败')
  }
}

// 保存个人信息
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    
    saving.value = true
    const response = await updateUser(authStore.user.id, profileForm.value)
    
    if (response.code === 200) {
      ElMessage.success('保存成功')
      
      // 更新本地用户信息
      userInfo.value = response.data
      authStore.updateUserInfo({
        username: profileForm.value.username,
        avatar: profileForm.value.avatar
      })
      
      isEditing.value = false
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error) {
    if (error !== false) {
      console.error('保存用户信息失败:', error)
      ElMessage.error('保存失败')
    }
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  // 恢复原始数据
  profileForm.value = {
    username: userInfo.value.username || '',
    email: userInfo.value.email || '',
    avatar: userInfo.value.avatar || '',
    address: userInfo.value.address || '',
    phone: userInfo.value.phone || ''
  }
  isEditing.value = false
}

// 头像上传前检查
const beforeAvatarUpload = (file) => {
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

// 处理头像上传
const handleAvatarUpload = async ({ file }) => {
  try {
    uploadProgress.value = 0
    
    const response = await uploadImage(file, (progress) => {
      uploadProgress.value = progress
    })
    
    if (response.code === 200 && response.data) {
      profileForm.value.avatar = response.data.fileUrl
      userInfo.value.avatar = response.data.fileUrl
      
      // 自动保存头像
      const updateResponse = await updateUser(authStore.user.id, {
        avatar: response.data.fileUrl
      })
      
      if (updateResponse.code === 200) {
        ElMessage.success('头像更新成功')
        authStore.updateUserInfo({
          avatar: response.data.fileUrl
        })
      }
    } else {
      ElMessage.error(response.message || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败')
  } finally {
    uploadProgress.value = 0
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// 打开修改密码对话框
const openPasswordDialog = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordDialogVisible.value = true
}

// 关闭修改密码对话框
const closePasswordDialog = () => {
  passwordDialogVisible.value = false
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 处理修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    changingPassword.value = true
    const response = await changePassword(authStore.user.id, {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    if (response.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      closePasswordDialog()
      
      // 延迟后退出登录
      setTimeout(() => {
        authStore.logout()
        router.push('/login')
      }, 1500)
    } else {
      ElMessage.error(response.message || '密码修改失败')
    }
  } catch (error) {
    if (error !== false) {
      console.error('修改密码失败:', error)
      ElMessage.error('密码修改失败')
    }
  } finally {
    changingPassword.value = false
  }
}

// 页面加载时初始化
onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.admin-profile {
  padding: 0;
}

.profile-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
  margin-bottom: 20px;
}

.avatar {
  border: 3px solid #f0f0f0;
  transition: all 0.3s;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: all 0.3s;
  font-size: 12px;
  gap: 5px;
}

.avatar-uploader:hover .avatar-mask {
  opacity: 1;
}

.upload-progress {
  margin-top: 10px;
  width: 120px;
}

.form-section {
  flex: 1;
  min-width: 0;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 安全设置 */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.security-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.security-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.security-desc {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  
  .form-section {
    width: 100%;
  }
}
</style>

