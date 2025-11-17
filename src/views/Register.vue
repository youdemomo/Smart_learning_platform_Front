<template>
    <div class="register-container">
        <div class="register-box">
            <div class="register-header">
                <h2>智慧学习平台</h2>
                <p>欢迎注册</p>
            </div>

            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" size="large" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" size="large" show-password />
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱" size="large" />
                </el-form-item>

                <el-form-item label="验证码" prop="verificationCode">
                    <div class="verification-input">
                        <el-input v-model="registerForm.verificationCode" placeholder="请输入邮箱验证码" size="large" style="flex: 1" />
                        <el-button
                            type="primary"
                            size="large"
                            :disabled="countdown > 0 || !registerForm.email"
                            @click="sendVerificationCode"
                            style="margin-left: 10px; width: 140px">
                            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="用户角色" prop="role">
                    <el-select v-model="registerForm.role" placeholder="请选择用户角色" size="large" style="width: 100%">
                        <el-option label="学生" value="STUDENT" />
                        <el-option label="培训机构" value="INSTITUTION" />
                    </el-select>
                </el-form-item>

                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="registerForm.phone" placeholder="请输入联系方式（可选）" size="large" />
                </el-form-item>

                <el-form-item label="学校/机构" prop="organization">
                    <el-input v-model="registerForm.organization" placeholder="请输入学校或机构名称（可选）" size="large" />
                </el-form-item>

                <el-form-item label="地址" prop="address">
                    <el-input v-model="registerForm.address" placeholder="请输入地址（可选）" size="large" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="large" :loading="loading" class="register-button" @click="handleRegister"> 注册 </el-button>
                </el-form-item>

                <div class="register-footer">
                    <span>已有账号？</span>
                    <router-link to="/login" class="login-link"> 立即登录 </router-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const authStore = useAuthStore()

    const registerFormRef = ref()
    const loading = ref(false)

    const registerForm = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        verificationCode: '',
        role: '',
        phone: '',
        organization: '',
        address: '',
    })

    const countdown = ref(0)
    let timer = null

    const validatePassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== registerForm.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }

    const registerRules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 50, message: '用户名长度在 3 到 50 个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 100, message: '密码长度在 6 到 100 个字符', trigger: 'blur' },
        ],
        confirmPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
        role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        verificationCode: [
            { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
            { len: 6, message: '验证码为6位数字', trigger: 'blur' },
        ],
    }

    // 发送验证码
    const sendVerificationCode = async () => {
        // 验证邮箱格式
        if (!registerForm.email) {
            ElMessage.warning('请先输入邮箱')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(registerForm.email)) {
            ElMessage.warning('请输入正确的邮箱格式')
            return
        }

        try {
            // 只发送验证码，不创建用户
            const { sendCode } = await import('@/api/auth')
            const response = await sendCode(registerForm.email)

            if (response.code === 200) {
                ElMessage.success('验证码已发送，请查看后端控制台')

                // 开始倒计时
                countdown.value = 60
                timer = setInterval(() => {
                    countdown.value--
                    if (countdown.value <= 0) {
                        clearInterval(timer)
                    }
                }, 1000)
            } else {
                ElMessage.error(response.message || '发送验证码失败')
            }
        } catch (error) {
            ElMessage.error(error.message || '发送验证码失败')
        }
    }

    const handleRegister = async () => {
        if (!registerFormRef.value) return

        await registerFormRef.value.validate(async (valid) => {
            if (valid) {
                loading.value = true
                try {
                    // 提交完整的注册信息（包含验证码）
                    const { confirmPassword, ...registerData } = registerForm
                    const response = await authStore.registerUser(registerData)

                    if (response.code === 200) {
                        ElMessage.success('注册成功！')

                        // 根据用户角色跳转到不同页面
                        setTimeout(() => {
                            const userRole = authStore.userRole

                            if (userRole === 'ADMIN') {
                                router.push('/admin/dashboard')
                            } else {
                                router.push('/home')
                            }
                        }, 1500)
                    } else {
                        ElMessage.error(response.message || '注册失败')
                    }
                } catch (error) {
                    ElMessage.error(error.message || '注册失败')
                } finally {
                    loading.value = false
                }
            }
        })
    }
</script>

<style scoped>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-box {
        width: 500px;
        padding: 40px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .register-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .register-header h2 {
        font-size: 28px;
        color: #333;
        margin-bottom: 10px;
    }

    .register-header p {
        font-size: 14px;
        color: #999;
    }

    .register-form {
        margin-top: 20px;
    }

    .register-button {
        width: 100%;
    }

    .verification-input {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .register-footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #666;
    }

    .login-link {
        color: #667eea;
        text-decoration: none;
        margin-left: 5px;
    }

    .login-link:hover {
        text-decoration: underline;
    }
</style>
