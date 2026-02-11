<template>
  <div class="submit-plugin-page">
    <n-layout-header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <n-button quaternary circle @click="goBack">
            <template #icon>
              <n-icon><arrow-back /></n-icon>
            </template>
          </n-button>
          <h1>提交插件</h1>
        </div>
        <div class="header-right">
          <n-button quaternary circle @click="toggleTheme">
            <template #icon>
              <n-icon>
                <moon v-if="isDarkMode" />
                <sunny v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-layout-header>

    <div class="page-content">
      <div class="main-section">
        <div class="form-section">
          <n-card title="基本信息" class="form-card">
            <p class="form-card-tip">请填写公开可访问的插件信息，必填项完整后可自动生成并预填 GitHub Issue。</p>
            <n-form ref="formRef" :model="formData" :rules="rules" label-placement="top">
              <div class="form-grid">
                <div class="form-field">
                  <n-form-item label="插件名" path="name">
                    <n-input 
                      v-model:value="formData.name" 
                      placeholder="插件名，请以 astrbot_plugin_ 开头"
                    />
                  </n-form-item>
                </div>
                <div class="form-field">
                  <n-form-item label="展示名称" path="display_name">
                    <n-input 
                      v-model:value="formData.display_name" 
                      placeholder="用于展示的插件名，方便人类阅读"
                    />
                  </n-form-item>
                </div>
                <div class="form-field form-field--full">
                  <n-form-item label="插件介绍" path="desc">
                    <n-input 
                      v-model:value="formData.desc" 
                      type="textarea" 
                      placeholder="插件的简短介绍（支持中文与空格）"
                      :maxlength="MAX_DESC_LENGTH"
                      :show-count="true"
                      :rows="4"
                      class="desc-textarea"
                      :resizable="false"
                    />
                  </n-form-item>
                </div>
                <div class="form-field">
                  <n-form-item label="作者" path="author">
                    <n-input v-model:value="formData.author" placeholder="请输入作者名称" />
                  </n-form-item>
                </div>
                <div class="form-field">
                  <n-form-item label="仓库地址" path="repo">
                    <n-input v-model:value="formData.repo" placeholder="请输入GitHub仓库地址" />
                  </n-form-item>
                </div>
                <div class="form-field form-field--full">
                  <n-form-item label="标签（可选，最多 5 个，按回车添加）" path="tags">
                    <n-dynamic-tags 
                      v-model:value="formData.tags" 
                      :max="5"
                    />
                  </n-form-item>
                </div>
                <div class="form-field form-field--full">
                  <n-form-item label="社交链接（可选）" path="social_link">
                    <n-input 
                      v-model:value="formData.social_link" 
                      placeholder="请输入完整的社交链接，如个人主页、Twitter等，推荐 GitHub 主页" 
                    />
                  </n-form-item>
                </div>
              </div>
            </n-form>
            <div class="form-actions">
              <n-button class="action-btn" @click="copyJSON" secondary>
                <template #icon>
                  <n-icon><copy /></n-icon>
                </template>
                复制JSON
              </n-button>
              <n-button class="action-btn" type="primary" @click="submitPlugin">
                提交到GitHub
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { 
  NLayoutHeader,
  NForm, 
  NFormItem, 
  NInput, 
  NButton,
  NDynamicTags,
  NCard,
  NIcon,
  useMessage
} from 'naive-ui'
import { 
  ArrowBack, 
  Copy,
  Moon,
  Sunny
} from '@vicons/ionicons5'
import { usePluginStore } from '@/stores/plugins'

const router = useRouter()
const message = useMessage()
const store = usePluginStore()
const formRef = ref(null)
const generatedJSON = ref('')
const MAX_DESC_LENGTH = 70
const ISSUE_BASE_URL = 'https://github.com/vmoranv-reborn/AstrBot_Plugins_Collection/issues/new'
const ISSUE_TEMPLATE = 'PLUGIN_PUBLISH.yml'

const { isDarkMode } = storeToRefs(store)
const toggleTheme = () => {
  store.toggleTheme()
}

const formData = reactive({
  name: '',
  display_name: '',
  desc: '',
  author: '',
  repo: '',
  tags: [],
  social_link: ''
})

const rules = {
  name: [
    { required: true, message: '请输入插件名', trigger: 'blur' },
    { pattern: /^astrbot_plugin_[a-z0-9_-]+$/i, message: '插件名需以 astrbot_plugin_ 开头，仅含字母、数字、下划线、短横线', trigger: 'blur' }
  ],
  display_name: {
    required: true,
    message: '请输入用于展示的插件名',
    trigger: 'blur'
  },
  desc: [
    { required: true, message: '请输入插件的简短介绍', trigger: 'blur' },
    { 
      validator: (_, value) => Array.from((value || '').toString()).length <= MAX_DESC_LENGTH,
      message: `插件介绍最多${MAX_DESC_LENGTH}字`,
      trigger: ['input', 'blur']
    }
  ],
  author: {
    required: true,
    message: '请输入作者名称',
    trigger: 'blur'
  },
  repo: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' },
    { pattern: /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/, message: '请输入有效的GitHub仓库地址', trigger: 'blur' }
  ],
  tags: [
    {
      validator: (_, value) => !Array.isArray(value) || value.length <= 5,
      message: '标签最多 5 个',
      trigger: ['change', 'blur']
    }
  ]
}

const goBack = () => {
  router.back()
}

const validateForm = () => new Promise((resolve, reject) => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      resolve(true)
      return
    }
    reject(errors)
  })
})

const buildJsonData = () => ({
  name: formData.name,
  display_name: formData.display_name,
  desc: formData.desc,
  author: formData.author,
  repo: formData.repo,
  tags: formData.tags,
  social_link: formData.social_link
})

const generateJsonText = () => JSON.stringify(buildJsonData(), null, 2)

const normalizeFormState = async () => {
  try {
    await validateForm()
    generatedJSON.value = generateJsonText()
    return true
  } catch (err) {
    message.error('请完善必填信息')
    return false
  }
}

const copyJSON = async () => {
  const valid = await normalizeFormState()
  if (!valid) {
    return
  }
  try {
    await navigator.clipboard.writeText(generatedJSON.value)
    message.success('JSON已复制到剪贴板')
  } catch (err) {
    message.error('复制失败')
  }
}

const submitPlugin = async () => {
  const valid = await normalizeFormState()
  if (!valid) {
    return
  }
  const jsonToSubmit = generatedJSON.value
  const issueParams = new URLSearchParams({
    template: ISSUE_TEMPLATE,
    title: `[Plugin] ${formData.display_name || formData.name || '插件提交'}`,
    'plugin-info': `\`\`\`json\n${jsonToSubmit}\n\`\`\``
  })
  const issueUrl = `${ISSUE_BASE_URL}?${issueParams.toString()}`
  const issueWindow = window.open(issueUrl, '_blank', 'noopener,noreferrer')
  if (!issueWindow) {
    window.location.href = issueUrl
  }
  message.success('已打开 GitHub Issue，插件信息已自动预填')
}
</script>

<style scoped>
.submit-plugin-page {
  height: 100dvh;
  background: var(--bg-base);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image:
    radial-gradient(circle at 8% -5%, rgba(255, 153, 0, 0.18), transparent 36%),
    radial-gradient(circle at 92% 8%, rgba(255, 153, 0, 0.1), transparent 30%);
}

.page-header {
  padding: 14px 0;
  background: color-mix(in srgb, var(--bg-base) 86%, transparent);
  border-bottom: 1px solid var(--border-base);
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(12px);
}

.header-content {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.01em;
  margin: 0;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left .n-button,
.header-right .n-button {
  border: 1px solid var(--border-base);
  border-radius: 10px;
  background: color-mix(in srgb, var(--bg-card) 92%, transparent);
}

.steps-section {
  padding: 18px 0 14px;
}

.custom-steps {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
}

.custom-steps::before {
  content: '';
  position: absolute;
  left: calc(18px + 20px);
  right: calc(18px + 20px);
  top: 20px;
  height: 2px;
  background: color-mix(in srgb, var(--border-base) 82%, transparent);
  z-index: 0;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 8px;
  z-index: 1;
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--border-base) 70%, var(--primary-color));
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  background: var(--bg-base);
  transition: all 0.25s ease;
}

.step-content {
  text-align: center;
  min-width: 112px;
  padding: 0 6px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
  color: var(--text-primary);
}

.step-description {
  font-size: 12px;
  color: var(--text-tertiary);
}

.step-current {
  transform: translateY(-1px);
}

.step-current .step-indicator {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-tag);
  box-shadow: 0 8px 20px rgba(255, 153, 0, 0.28);
}

.step-current .step-title {
  color: var(--primary-color);
}

.step-current .step-description {
  color: var(--text-secondary);
}

.step-finished .step-indicator {
  background: color-mix(in srgb, var(--primary-color) 92%, #ffffff 8%);
  border-color: var(--primary-color);
  color: var(--text-tag);
}

.step-finished .step-title {
  color: var(--text-primary);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: transparent;
  padding: 22px 18px;
  box-sizing: border-box;
  scrollbar-gutter: stable;
}

.page-content :deep(.n-card) {
  background: color-mix(in srgb, var(--bg-card) 96%, transparent);
  border-color: var(--border-base);
}

.main-section {
  flex: 1;
  max-width: 980px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
}

.form-card,
.json-card,
.guide-card {
  margin-bottom: 0;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--primary-color) 48%, var(--border-base));
  border-radius: 14px;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.form-card-tip {
  margin: 0 0 14px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid color-mix(in srgb, var(--border-base) 78%, transparent);
  margin-top: 6px;
  padding-top: 14px;
}

.action-btn {
  min-width: 112px;
  border-radius: 10px;
}

.json-preview-section {
  width: 100%;
}

.json-preview-section :deep(.n-code) {
  border-radius: 10px;
  background: color-mix(in srgb, var(--bg-base) 95%, transparent);
  border: 1px solid var(--border-base);
}

.json-content {
  position: relative;
  animation: fadeInUp 0.35s ease;
}

.copy-button {
  border-radius: 10px;
}

:deep(.n-form-item) {
  margin-bottom: 18px;
}

:deep(.n-form-item-label__text) {
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.n-input-group) {
  width: 100%;
}

:deep(.n-dynamic-tags) {
  min-height: 40px;
}

:deep(.n-card-header) {
  border-bottom: 1px solid color-mix(in srgb, var(--border-base) 78%, transparent);
}

.desc-textarea :deep(.n-input__textarea-el) {
  min-height: 120px !important;
}

.desc-textarea :deep(textarea),
.desc-textarea :deep(.n-input__textarea),
.desc-textarea :deep(.n-input-wrapper) {
  resize: none !important;
}

:deep(.n-timeline) {
  padding: 6px 8px 2px;
}

.submit-guide-section :deep(.n-timeline-item-content) {
  border: 1px solid var(--border-base);
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-field--full {
    grid-column: auto;
  }

  .step-description {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 0;
  }

  .header-content,
  .custom-steps {
    padding: 0 14px;
  }

  .custom-steps::before {
    left: calc(14px + 20px);
    right: calc(14px + 20px);
  }

  .step-content {
    min-width: 90px;
  }

  .page-content {
    padding: 16px 12px;
  }
}

@media (max-width: 540px) {
  .custom-steps::before {
    display: none;
  }

  .custom-steps {
    justify-content: center;
  }

  .step-item {
    display: none;
    flex: 0 1 auto;
  }

  .step-item.step-current {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

  .step-item.step-current .step-content {
    text-align: left;
    min-width: auto;
  }

  .step-item.step-current .step-description {
    display: block;
  }

  .step-item.step-current .step-indicator {
    width: 34px;
    height: 34px;
  }

  .header-left h1 {
    font-size: 20px;
  }

  .action-btn {
    min-width: 96px;
  }
}

@media (max-width: 420px) {
  .form-actions {
    gap: 8px;
  }

  .action-btn {
    min-width: 90px;
    padding-left: 12px;
    padding-right: 12px;
  }

  :deep(.n-card-header) {
    padding: 14px;
  }

  :deep(.n-card__content) {
    padding: 14px;
  }
}
</style>
