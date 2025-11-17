<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h2>智慧学习平台</h2>
                <p>欢迎登录</p>
            </div>

            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
                <!-- 身份选择 -->
                <el-form-item prop="role">
                    <el-radio-group v-model="loginForm.role" size="large" class="role-group">
                        <el-radio-button label="STUDENT">学生</el-radio-button>
                        <el-radio-button label="INSTITUTION">培训机构</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" :prefix-icon="User" />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" :prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
                </el-form-item>

                <!-- 图形验证码 -->
                <el-form-item prop="captcha">
                    <div class="captcha-container">
                        <el-input v-model="loginForm.captcha" placeholder="请输入验证码" size="large" style="flex: 1" @keyup.enter="handleLogin" />
                        <div class="captcha-image" @click="refreshCaptcha">
                            <canvas ref="captchaCanvas" width="120" height="40"></canvas>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="large" :loading="loading" class="login-button" @click="handleLogin"> 登录 </el-button>
                </el-form-item>

                <div class="login-footer">
                    <span>还没有账号？</span>
                    <router-link to="/register" class="register-link"> 立即注册 </router-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { User, Lock } from '@element-plus/icons-vue'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const authStore = useAuthStore()

    const loginFormRef = ref()
    const loading = ref(false)

    const loginForm = reactive({
        role: 'STUDENT',
        username: '',
        password: '',
        captcha: '',
    })

    const captchaCanvas = ref(null)
    const captchaCode = ref('')

    const loginRules = {
        role: [{ required: true, message: '请选择身份', trigger: 'change' }],
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 50, message: '用户名长度在 3 到 50 个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
        ],
        captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 4, message: '验证码为4位字符', trigger: 'blur' },
        ],
    }

    // 生成随机验证码
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        let code = ''
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    // 绘制验证码
    const drawCaptcha = () => {
        if (!captchaCanvas.value) return

        const canvas = captchaCanvas.value
        const ctx = canvas.getContext('2d')
        const width = canvas.width
        const height = canvas.height

        // 生成新验证码
        captchaCode.value = generateCaptcha()

        // 清空画布
        ctx.clearRect(0, 0, width, height)

        // 绘制背景
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, width, height)

        // 绘制干扰线
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
            ctx.beginPath()
            ctx.moveTo(Math.random() * width, Math.random() * height)
            ctx.lineTo(Math.random() * width, Math.random() * height)
            ctx.stroke()
        }

        // 绘制验证码文字
        const code = captchaCode.value
        for (let i = 0; i < code.length; i++) {
            ctx.font = `${20 + Math.random() * 10}px Arial`
            ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`
            ctx.textBaseline = 'middle'
            const x = 15 + i * 25
            const y = 20 + Math.random() * 5
            const angle = (Math.random() - 0.5) * 0.4
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle)
            ctx.fillText(code[i], 0, 0)
            ctx.restore()
        }

        // 绘制干扰点
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
            ctx.beginPath()
            ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
            ctx.fill()
        }
    }

    // 刷新验证码
    const refreshCaptcha = () => {
        drawCaptcha()
        loginForm.captcha = ''
    }

    // 组件挂载后生成验证码
    import { onMounted } from 'vue'
    onMounted(() => {
        drawCaptcha()
    })

    const handleLogin = async () => {
        if (!loginFormRef.value) return

        await loginFormRef.value.validate(async (valid) => {
            if (valid) {
                // 验证图形验证码
                if (loginForm.captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
                    ElMessage.error('验证码错误')
                    refreshCaptcha()
                    return
                }

                loading.value = true
                try {
                    const response = await authStore.loginUser({
                        username: loginForm.username,
                        password: loginForm.password,
                    })

                    // 验证登录角色是否匹配
                    const userRole = authStore.userRole
                    if (userRole !== loginForm.role && userRole !== 'ADMIN') {
                        ElMessage.error(`身份不匹配，您的账号是${userRole === 'STUDENT' ? '学生' : '培训机构'}身份`)
                        authStore.logout()
                        refreshCaptcha()
                        loading.value = false
                        return
                    }

                    ElMessage.success(response.message || '登录成功')

                    // 根据用户角色跳转到不同页面
                    if (userRole === 'ADMIN') {
                        // 管理员跳转到管理后台
                        router.push('/admin/dashboard')
                    } else if (userRole === 'INSTITUTION') {
                        // 培训机构跳转到首页（后续可改为机构管理页面）
                        router.push('/home')
                    } else if (userRole === 'STUDENT') {
                        // 学生跳转到首页
                        router.push('/home')
                    } else {
                        // 默认跳转到首页
                        router.push('/home')
                    }
                } catch (error) {
                    ElMessage.error(error.message || '登录失败')
                    refreshCaptcha()
                } finally {
                    loading.value = false
                }
            }
        })
    }
</script>

<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-box {
        width: 400px;
        padding: 40px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .login-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .login-header h2 {
        font-size: 28px;
        color: #333;
        margin-bottom: 10px;
    }

    .login-header p {
        font-size: 14px;
        color: #999;
    }

    .login-form {
        margin-top: 20px;
    }

    .role-group {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .role-group :deep(.el-radio-button__inner) {
        width: 120px;
    }

    .captcha-container {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .captcha-image {
        cursor: pointer;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        overflow: hidden;
        transition: all 0.3s;
    }

    .captcha-image:hover {
        border-color: #409eff;
        box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
    }

    .captcha-image canvas {
        display: block;
    }

    .login-button {
        width: 100%;
    }

    .login-footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #666;
    }

    .register-link {
        color: #667eea;
        text-decoration: none;
        margin-left: 5px;
    }

    .register-link:hover {
        text-decoration: underline;
    }
</style>
