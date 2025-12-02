<template>
    <div class="help-management">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>帮助文档管理</span>
                </div>
            </template>

            <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
                <el-tab-pane label="常见问题" name="FAQ">
                    <div class="help-editor">
                        <div class="editor-header">
                            <el-button type="primary" @click="handleAddFaq">
                                <el-icon><Plus /></el-icon>
                                添加问题
                            </el-button>
                        </div>
                        <el-table :data="faqList" stripe style="margin-top: 20px">
                            <el-table-column prop="question" label="问题" min-width="200" />
                            <el-table-column prop="answer" label="答案" min-width="300" show-overflow-tooltip />
                            <el-table-column label="操作" width="150" fixed="right">
                                <template #default="{ row, $index }">
                                    <el-button type="primary" link size="small" @click="handleEditFaq($index)"> 编辑 </el-button>
                                    <el-button type="danger" link size="small" @click="handleDeleteFaq($index)"> 删除 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="学生手册" name="STUDENT_MANUAL">
                    <div class="help-editor">
                        <div class="editor-header">
                            <el-button type="primary" @click="handleAddSection('student')">
                                <el-icon><Plus /></el-icon>
                                添加章节
                            </el-button>
                        </div>
                        <div class="manual-editor">
                            <div v-for="(section, sectionIndex) in studentManual" :key="sectionIndex" class="section-item">
                                <el-card shadow="hover" style="margin-bottom: 20px">
                                    <template #header>
                                        <div class="section-header">
                                            <el-input v-model="section.title" placeholder="章节标题" style="width: 300px" @blur="handleSave" />
                                            <el-button type="danger" link @click="handleDeleteSection('student', sectionIndex)">
                                                <el-icon><Delete /></el-icon>
                                                删除章节
                                            </el-button>
                                        </div>
                                    </template>
                                    <div class="section-content">
                                        <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="manual-item">
                                            <el-card shadow="never" style="margin-bottom: 15px">
                                                <div class="item-header">
                                                    <el-input v-model="item.subtitle" placeholder="子标题" style="width: 250px; margin-right: 10px" @blur="handleSave" />
                                                    <el-button type="danger" link size="small" @click="handleDeleteItem('student', sectionIndex, itemIndex)"> 删除 </el-button>
                                                </div>
                                                <el-input v-model="item.content" type="textarea" :rows="2" placeholder="内容描述" style="margin-top: 10px" @blur="handleSave" />
                                                <div class="list-editor" style="margin-top: 10px">
                                                    <div class="list-header">
                                                        <span>列表项：</span>
                                                        <el-button type="primary" link size="small" @click="handleAddListItem('student', sectionIndex, itemIndex)">
                                                            <el-icon><Plus /></el-icon>
                                                            添加
                                                        </el-button>
                                                    </div>
                                                    <div v-for="(listItem, listIndex) in item.list || []" :key="listIndex" class="list-item">
                                                        <el-input v-model="item.list[listIndex]" placeholder="列表项内容" style="width: calc(100% - 80px)" @blur="handleSave" />
                                                        <el-button type="danger" link size="small" @click="handleDeleteListItem('student', sectionIndex, itemIndex, listIndex)">
                                                            删除
                                                        </el-button>
                                                    </div>
                                                </div>
                                            </el-card>
                                        </div>
                                        <el-button type="primary" link @click="handleAddItem('student', sectionIndex)">
                                            <el-icon><Plus /></el-icon>
                                            添加子项
                                        </el-button>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="培训机构手册" name="INSTITUTION_MANUAL">
                    <div class="help-editor">
                        <div class="editor-header">
                            <el-button type="primary" @click="handleAddSection('institution')">
                                <el-icon><Plus /></el-icon>
                                添加章节
                            </el-button>
                        </div>
                        <div class="manual-editor">
                            <div v-for="(section, sectionIndex) in institutionManual" :key="sectionIndex" class="section-item">
                                <el-card shadow="hover" style="margin-bottom: 20px">
                                    <template #header>
                                        <div class="section-header">
                                            <el-input v-model="section.title" placeholder="章节标题" style="width: 300px" @blur="handleSave" />
                                            <el-button type="danger" link @click="handleDeleteSection('institution', sectionIndex)">
                                                <el-icon><Delete /></el-icon>
                                                删除章节
                                            </el-button>
                                        </div>
                                    </template>
                                    <div class="section-content">
                                        <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="manual-item">
                                            <el-card shadow="never" style="margin-bottom: 15px">
                                                <div class="item-header">
                                                    <el-input v-model="item.subtitle" placeholder="子标题" style="width: 250px; margin-right: 10px" @blur="handleSave" />
                                                    <el-button type="danger" link size="small" @click="handleDeleteItem('institution', sectionIndex, itemIndex)"> 删除 </el-button>
                                                </div>
                                                <el-input v-model="item.content" type="textarea" :rows="2" placeholder="内容描述" style="margin-top: 10px" @blur="handleSave" />
                                                <div class="list-editor" style="margin-top: 10px">
                                                    <div class="list-header">
                                                        <span>列表项：</span>
                                                        <el-button type="primary" link size="small" @click="handleAddListItem('institution', sectionIndex, itemIndex)">
                                                            <el-icon><Plus /></el-icon>
                                                            添加
                                                        </el-button>
                                                    </div>
                                                    <div v-for="(listItem, listIndex) in item.list || []" :key="listIndex" class="list-item">
                                                        <el-input v-model="item.list[listIndex]" placeholder="列表项内容" style="width: calc(100% - 80px)" @blur="handleSave" />
                                                        <el-button type="danger" link size="small" @click="handleDeleteListItem('institution', sectionIndex, itemIndex, listIndex)">
                                                            删除
                                                        </el-button>
                                                    </div>
                                                </div>
                                            </el-card>
                                        </div>
                                        <el-button type="primary" link @click="handleAddItem('institution', sectionIndex)">
                                            <el-icon><Plus /></el-icon>
                                            添加子项
                                        </el-button>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div class="save-button-wrapper">
                <el-button type="primary" size="large" @click="handleSave" :loading="saving">
                    <el-icon><Check /></el-icon>
                    保存所有更改
                </el-button>
            </div>
        </el-card>

        <!-- 添加/编辑问题对话框 -->
        <el-dialog v-model="faqDialogVisible" :title="faqDialogTitle" width="600px" :close-on-click-modal="false">
            <el-form ref="faqFormRef" :model="faqForm" :rules="faqRules" label-width="80px">
                <el-form-item label="问题" prop="question">
                    <el-input v-model="faqForm.question" placeholder="请输入问题" />
                </el-form-item>
                <el-form-item label="答案" prop="answer">
                    <el-input v-model="faqForm.answer" type="textarea" :rows="4" placeholder="请输入答案" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="faqDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitFaq">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { ElMessage } from 'element-plus'
    import { Plus, Delete, Check } from '@element-plus/icons-vue'
    import { getHelpDocumentByType, saveHelpDocument } from '@/api/help'

    const activeTab = ref('FAQ')
    const saving = ref(false)
    const faqList = ref([])
    const studentManual = ref([])
    const institutionManual = ref([])

    // FAQ对话框
    const faqDialogVisible = ref(false)
    const faqDialogTitle = ref('添加问题')
    const faqEditIndex = ref(-1)
    const faqFormRef = ref(null)
    const faqForm = ref({
        question: '',
        answer: '',
    })
    const faqRules = {
        question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
    }

    // 加载数据
    const loadData = async () => {
        try {
            // 加载常见问题
            try {
                const faqResponse = await getHelpDocumentByType('FAQ')
                if (faqResponse.code === 200 && faqResponse.data) {
                    faqList.value = JSON.parse(faqResponse.data.content)
                }
            } catch (error) {
                console.log('常见问题未初始化，使用默认数据')
            }

            // 加载学生手册
            try {
                const studentResponse = await getHelpDocumentByType('STUDENT_MANUAL')
                if (studentResponse.code === 200 && studentResponse.data) {
                    studentManual.value = JSON.parse(studentResponse.data.content)
                }
            } catch (error) {
                console.log('学生手册未初始化，使用默认数据')
            }

            // 加载培训机构手册
            try {
                const institutionResponse = await getHelpDocumentByType('INSTITUTION_MANUAL')
                if (institutionResponse.code === 200 && institutionResponse.data) {
                    institutionManual.value = JSON.parse(institutionResponse.data.content)
                }
            } catch (error) {
                console.log('培训机构手册未初始化，使用默认数据')
            }
        } catch (error) {
            console.error('加载帮助文档失败:', error)
        }
    }

    // 保存数据
    const handleSave = async () => {
        saving.value = true
        try {
            // 保存常见问题
            await saveHelpDocument({
                type: 'FAQ',
                content: JSON.stringify(faqList.value),
            })

            // 保存学生手册
            await saveHelpDocument({
                type: 'STUDENT_MANUAL',
                content: JSON.stringify(studentManual.value),
            })

            // 保存培训机构手册
            await saveHelpDocument({
                type: 'INSTITUTION_MANUAL',
                content: JSON.stringify(institutionManual.value),
            })

            ElMessage.success('保存成功')
        } catch (error) {
            ElMessage.error(error.message || '保存失败')
        } finally {
            saving.value = false
        }
    }

    // 标签切换
    const handleTabChange = () => {
        // 切换标签时自动保存
        handleSave()
    }

    // FAQ相关操作
    const handleAddFaq = () => {
        faqDialogTitle.value = '添加问题'
        faqEditIndex.value = -1
        faqForm.value = { question: '', answer: '' }
        faqDialogVisible.value = true
    }

    const handleEditFaq = (index) => {
        faqDialogTitle.value = '编辑问题'
        faqEditIndex.value = index
        faqForm.value = {
            question: faqList.value[index].question,
            answer: faqList.value[index].answer,
        }
        faqDialogVisible.value = true
    }

    const handleDeleteFaq = (index) => {
        faqList.value.splice(index, 1)
        handleSave()
    }

    const handleSubmitFaq = async () => {
        if (!faqFormRef.value) return

        await faqFormRef.value.validate((valid) => {
            if (valid) {
                if (faqEditIndex.value >= 0) {
                    faqList.value[faqEditIndex.value] = { ...faqForm.value }
                } else {
                    faqList.value.push({ ...faqForm.value })
                }
                faqDialogVisible.value = false
                handleSave()
            }
        })
    }

    // 手册相关操作
    const handleAddSection = (type) => {
        const newSection = {
            title: '新章节',
            items: [],
        }
        if (type === 'student') {
            studentManual.value.push(newSection)
        } else {
            institutionManual.value.push(newSection)
        }
        handleSave()
    }

    const handleDeleteSection = (type, sectionIndex) => {
        if (type === 'student') {
            studentManual.value.splice(sectionIndex, 1)
        } else {
            institutionManual.value.splice(sectionIndex, 1)
        }
        handleSave()
    }

    const handleAddItem = (type, sectionIndex) => {
        const newItem = {
            subtitle: '',
            content: '',
            list: [],
        }
        if (type === 'student') {
            studentManual.value[sectionIndex].items.push(newItem)
        } else {
            institutionManual.value[sectionIndex].items.push(newItem)
        }
        handleSave()
    }

    const handleDeleteItem = (type, sectionIndex, itemIndex) => {
        if (type === 'student') {
            studentManual.value[sectionIndex].items.splice(itemIndex, 1)
        } else {
            institutionManual.value[sectionIndex].items.splice(itemIndex, 1)
        }
        handleSave()
    }

    const handleAddListItem = (type, sectionIndex, itemIndex) => {
        if (type === 'student') {
            if (!studentManual.value[sectionIndex].items[itemIndex].list) {
                studentManual.value[sectionIndex].items[itemIndex].list = []
            }
            studentManual.value[sectionIndex].items[itemIndex].list.push('')
        } else {
            if (!institutionManual.value[sectionIndex].items[itemIndex].list) {
                institutionManual.value[sectionIndex].items[itemIndex].list = []
            }
            institutionManual.value[sectionIndex].items[itemIndex].list.push('')
        }
        handleSave()
    }

    const handleDeleteListItem = (type, sectionIndex, itemIndex, listIndex) => {
        if (type === 'student') {
            studentManual.value[sectionIndex].items[itemIndex].list.splice(listIndex, 1)
        } else {
            institutionManual.value[sectionIndex].items[itemIndex].list.splice(listIndex, 1)
        }
        handleSave()
    }

    onMounted(() => {
        loadData()
    })
</script>

<style scoped>
    .help-management {
        padding: 20px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .help-editor {
        padding: 20px 0;
    }

    .editor-header {
        margin-bottom: 20px;
    }

    .manual-editor {
        max-height: 70vh;
        overflow-y: auto;
    }

    .section-item {
        margin-bottom: 20px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .section-content {
        padding: 10px 0;
    }

    .manual-item {
        margin-bottom: 15px;
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .list-editor {
        margin-top: 10px;
    }

    .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
    }

    .list-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .save-button-wrapper {
        margin-top: 30px;
        text-align: center;
        padding: 20px 0;
        border-top: 1px solid #ebeef5;
    }
</style>
