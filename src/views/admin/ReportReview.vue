<template>
  <div class="report-review">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>课程举报审核</span>
          <el-button type="primary" @click="loadReports">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="举报类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable style="width: 150px;">
            <el-option label="课程" value="COURSE" />
            <el-option label="评论" value="REVIEW" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 150px;">
            <el-option label="待处理" value="PENDING" />
            <el-option label="处理中" value="PROCESSING" />
            <el-option label="已处理" value="RESOLVED" />
            <el-option label="已拒绝" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 举报列表 -->
      <el-table :data="reports" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="举报类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'COURSE' ? 'primary' : 'success'">
              {{ row.targetTypeName || row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="被举报内容" min-width="200">
          <template #default="{ row }">
            <div class="target-content">
              <div class="target-title">{{ row.targetTitle || '未知' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reporterName" label="举报人" width="120" />
        <el-table-column prop="reason" label="举报原因" width="120" />
        <el-table-column label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="机构回复" min-width="200">
          <template #default="{ row }">
            <div v-if="row.institutionReply" class="reply-content">
              {{ row.institutionReply }}
              <div class="reply-time">{{ formatDate(row.institutionRepliedAt) }}</div>
            </div>
            <span v-else class="no-reply">未回复</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleViewDetail(row)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="row.status === 'PENDING' || row.status === 'PROCESSING'"
              type="success"
              link
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 'PENDING' || row.status === 'PROCESSING'"
              type="danger"
              link
              size="small"
              @click="handleReject(row)"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadReports"
          @current-change="loadReports"
        />
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="举报详情"
      width="700px"
    >
      <div v-if="currentReport" class="report-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="举报ID">{{ currentReport.id }}</el-descriptions-item>
          <el-descriptions-item label="举报类型">
            <el-tag :type="currentReport.type === 'COURSE' ? 'primary' : 'success'">
              {{ currentReport.targetTypeName || currentReport.type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="被举报内容" :span="2">
            {{ currentReport.targetTitle || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="举报人">{{ currentReport.reporterName }}</el-descriptions-item>
          <el-descriptions-item label="举报时间">{{ formatDate(currentReport.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="举报原因" :span="2">{{ currentReport.reason }}</el-descriptions-item>
          <el-descriptions-item label="举报详情" :span="2">
            <div class="description-text">{{ currentReport.description || '无' }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getStatusType(currentReport.status)">
              {{ getStatusText(currentReport.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理时间">
            {{ currentReport.handledAt ? formatDate(currentReport.handledAt) : '未处理' }}
          </el-descriptions-item>
          <el-descriptions-item label="机构回复" :span="2">
            <div v-if="currentReport.institutionReply" class="reply-content">
              {{ currentReport.institutionReply }}
              <div class="reply-time">回复时间：{{ formatDate(currentReport.institutionRepliedAt) }}</div>
            </div>
            <span v-else class="no-reply">未回复</span>
          </el-descriptions-item>
          <el-descriptions-item label="处理结果" :span="2">
            <div class="description-text">{{ currentReport.result || '无' }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 处理对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      :title="handleType === 'approve' ? '通过举报' : '拒绝举报'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="handleFormRef"
        :model="handleForm"
        :rules="handleRules"
        label-width="100px"
      >
        <el-form-item label="处理结果" prop="result">
          <el-input
            v-model="handleForm.result"
            type="textarea"
            :rows="6"
            :placeholder="handleType === 'approve' ? '请输入处理结果说明（可选）' : '请输入拒绝原因'"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getAllReports, handleReport } from '@/api/report'
import { formatDate } from '@/utils/dateFormat'

const loading = ref(false)
const reports = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filterForm = ref({
  type: '',
  status: ''
})

const detailDialogVisible = ref(false)
const handleDialogVisible = ref(false)
const currentReport = ref(null)
const handleFormRef = ref(null)
const submitting = ref(false)
const handleType = ref('approve') // 'approve' 或 'reject'

const handleForm = ref({
  result: ''
})

const handleRules = {
  result: [
    { max: 1000, message: '处理结果不能超过1000个字符', trigger: 'blur' }
  ]
}

// 加载举报列表
const loadReports = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      size: pageSize.value
    }
    
    if (filterForm.value.type) {
      params.type = filterForm.value.type
    }
    if (filterForm.value.status) {
      params.status = filterForm.value.status
    }
    
    const response = await getAllReports(params)
    if (response.code === 200 && response.data) {
      reports.value = response.data.records || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('加载举报列表失败:', error)
    ElMessage.error('加载举报列表失败')
  } finally {
    loading.value = false
  }
}

// 筛选
const handleFilter = () => {
  page.value = 1
  loadReports()
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    type: '',
    status: ''
  }
  page.value = 1
  loadReports()
}

// 查看详情
const handleViewDetail = (report) => {
  currentReport.value = report
  detailDialogVisible.value = true
}

// 通过举报
const handleApprove = (report) => {
  currentReport.value = report
  handleType.value = 'approve'
  handleForm.value.result = ''
  handleDialogVisible.value = true
}

// 拒绝举报
const handleReject = (report) => {
  currentReport.value = report
  handleType.value = 'reject'
  handleForm.value.result = ''
  handleDialogVisible.value = true
}

// 提交处理
const handleSubmit = async () => {
  if (!handleFormRef.value) return

  handleFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const status = handleType.value === 'approve' ? 'RESOLVED' : 'REJECTED'
      const response = await handleReport(
        currentReport.value.id,
        status,
        handleForm.value.result || ''
      )

      if (response.code === 200) {
        ElMessage.success('处理成功')
        handleDialogVisible.value = false
        handleFormRef.value.resetFields()
        loadReports()
      } else {
        ElMessage.error(response.message || '处理失败')
      }
    } catch (error) {
      console.error('处理失败:', error)
      ElMessage.error(error.message || '处理失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'PENDING': 'info',
    'PROCESSING': 'warning',
    'RESOLVED': 'success',
    'REJECTED': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'PROCESSING': '处理中',
    'RESOLVED': '已处理',
    'REJECTED': '已拒绝'
  }
  return statusMap[status] || status
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.report-review {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  margin-bottom: 20px;
}

.target-content {
  max-width: 200px;
}

.target-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.reply-content {
  color: #409EFF;
  font-size: 13px;
  line-height: 1.6;
}

.reply-time {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.no-reply {
  color: #999;
  font-style: italic;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.report-detail {
  padding: 10px 0;
}

.description-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}
</style>

