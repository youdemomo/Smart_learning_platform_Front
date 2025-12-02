<template>
    <div class="review-management">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>课程审核</span>
                </div>
            </template>

            <!-- 筛选栏 -->
            <el-form :inline="true" class="search-form">
                <el-form-item label="课程名称">
                    <el-input v-model="searchKeyword" placeholder="请输入课程名称" clearable style="width: 220px" />
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="searchStatus" placeholder="请选择" clearable style="width: 180px">
                        <el-option label="待审核" value="PENDING" />
                        <el-option label="已通过" value="APPROVED" />
                        <el-option label="已拒绝" value="REJECTED" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadCourses">搜索</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 课程审核表格 -->
            <el-table :data="courseList" v-loading="loading" stripe>
                <el-table-column prop="id" label="ID" width="70" />

                <el-table-column label="封面" width="120">
                    <template #default="{ row }">
                        <el-image v-if="row.coverImage" :src="row.coverImage" fit="cover" style="width: 80px; height: 60px; border-radius: 4px" />
                        <span v-else style="color: #999">暂无封面</span>
                    </template>
                </el-table-column>

                <el-table-column prop="title" label="课程名称" min-width="200" />

                <el-table-column prop="category" label="分类" width="120" />

                <el-table-column label="创建者" width="140">
                    <template #default="{ row }">
                        {{ row.creatorName }}
                    </template>
                </el-table-column>

                <el-table-column label="收费类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isPaid ? 'warning' : 'success'">
                            {{ row.isPaid ? '付费' : '免费' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="价格" width="100">
                    <template #default="{ row }">
                        {{ row.isPaid ? `¥${row.price}` : '-' }}
                    </template>
                </el-table-column>

                <el-table-column label="审核状态" width="110">
                    <template #default="{ row }">
                        <el-tag v-if="row.status === 'PENDING'" type="warning">待审核</el-tag>
                        <el-tag v-else-if="row.status === 'APPROVED'" type="success">已通过</el-tag>
                        <el-tag v-else-if="row.status === 'REJECTED'" type="danger">已拒绝</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="reviewNote" label="审核备注" min-width="180">
                    <template #default="{ row }">
                        {{ row.reviewNote || '-' }}
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" width="180">
                    <template #default="{ row }">
                        {{ formatDate(row.createdAt) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button type="success" size="small" :disabled="row.status === 'APPROVED'" @click="handleApprove(row)"> 通过 </el-button>
                        <el-button type="danger" size="small" :disabled="row.status === 'REJECTED'" @click="handleReject(row)"> 拒绝 </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :total="total"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="loadCourses"
                    @size-change="loadCourses" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { getAllCourses, reviewCourse } from '@/api/course'
    import { formatDate } from '@/utils/dateFormat'

    const courseList = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const searchKeyword = ref('')
    // 默认只看待审核的课程
    const searchStatus = ref('PENDING')

    // 加载课程列表（用于审核）
    const loadCourses = async () => {
        loading.value = true
        try {
            const params = {
                page: currentPage.value - 1,
                size: pageSize.value,
                keyword: searchKeyword.value,
                status: searchStatus.value,
            }
            const res = await getAllCourses(params)
            console.log('getAllCourses response:', res)

            if (res.code === 200 && res.data) {
                courseList.value = res.data.records || []
                total.value = res.data.total || 0
            } else {
                ElMessage.error(res.message || '加载课程列表失败')
            }
        } catch (error) {
            ElMessage.error(error.message || '加载课程列表失败')
        } finally {
            loading.value = false
        }
    }

    // 重置筛选
    const resetSearch = () => {
        searchKeyword.value = ''
        searchStatus.value = 'PENDING'
        currentPage.value = 1
        loadCourses()
    }

    // 通过课程
    const handleApprove = (row) => {
        ElMessageBox.confirm(`确定通过课程「${row.title}」的审核吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(async () => {
                try {
                    await reviewCourse(row.id, 'APPROVED', '')
                    ElMessage.success('审核通过')
                    loadCourses()
                } catch (error) {
                    ElMessage.error(error.message || '操作失败')
                }
            })
            .catch(() => {})
    }

    // 拒绝课程
    const handleReject = (row) => {
        ElMessageBox.prompt('请输入拒绝原因', '拒绝课程审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入拒绝原因（选填）',
            type: 'warning',
        })
            .then(async ({ value }) => {
                try {
                    await reviewCourse(row.id, 'REJECTED', value || '')
                    ElMessage.success('已拒绝该课程')
                    loadCourses()
                } catch (error) {
                    ElMessage.error(error.message || '操作失败')
                }
            })
            .catch(() => {})
    }

    onMounted(() => {
        loadCourses()
    })
</script>

<style scoped>
    .review-management {
        width: 100%;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-form {
        margin-bottom: 20px;
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
</style>
