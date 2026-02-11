<template>
  <div class="float-button-wrapper">
    <transition name="float-button-fade">
      <div class="help-button-container">
        <div class="help-text-container">
          <div class="help-text" :class="{ 'help-text--show': showHelpText }">
            有疑问？来看看呗！
          </div>
        </div>
        <div 
          class="float-button help-button"
          @click="toggleHelp"
          role="button"
          aria-label="帮助"
        >
          <div class="float-button__inner help-button__inner">
            <n-icon size="22" class="float-button__icon">
              <help-circle />
            </n-icon>
            <div class="float-button__ripple"></div>
          </div>
        </div>
      </div>
    </transition>

    <n-modal 
      v-model:show="showHelp" 
      :mask-closable="true" 
      class="help-modal"
      :class="{ 'help-modal--mobile': isMobile }"
      :style="modalStyle"
      transform-origin="center"
    >
      <n-card :bordered="false" size="huge" role="dialog" aria-label="帮助信息" class="help-card">
        <template #header>
          <div class="help-modal__header">
            <n-h2 class="help-modal__title">
              <n-icon size="24" class="help-modal__icon">
                <help-circle />
              </n-icon>
              {{ helpContent.title }}
            </n-h2>
          </div>
        </template>
        <n-space vertical size="large" class="help-modal__content">
          <div 
            v-for="(section, index) in helpContent.sections" 
            :key="index" 
            class="help-section"
          >
            <div class="help-section__header">
              <n-h3>{{ section.title }}</n-h3>
            </div>
            <div class="markdown-content" v-html="marked(section.content)"></div>
          </div>
        </n-space>
        <template #footer>
          <div class="help-modal__footer">
            <div class="help-modal__footer-content">
              <div class="panel-link">
                <n-text depth="3">AstrBot 面板地址：</n-text>
                <div class="panel-input-group">
                  <n-input
                    v-model:value="panelUrl"
                    type="text"
                    placeholder="例如：demo.astrbot.app"
                    class="panel-input"
                  />
                  <n-button
                    secondary
                    type="primary"
                    @click="openPanelUrl"
                    :disabled="!panelUrl"
                  >
                    <template #icon>
                      <n-icon><open-outline /></n-icon>
                    </template>
                    打开面板
                  </n-button>
                </div>
              </div>
              <n-button
                type="primary"
                @click="showHelp = false"
                class="help-modal__close-btn"
              >
                我知道了
              </n-button>
            </div>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NIcon, NModal, NCard, NSpace, NH2, NH3, NText, NButton, NInput } from 'naive-ui'
import { HelpCircle, OpenOutline } from '@vicons/ionicons5'
import { helpContent } from '../config/helpContent'
import { marked } from 'marked'

const isMobile = ref(window.innerWidth <= 768)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

const modalStyle = computed(() => {
  if (isMobile.value) {
    return {
      width: '100%',
      maxWidth: 'none'
    }
  }
  return {
    width: '90%',
    maxWidth: '600px'
  }
})

marked.setOptions({
  gfm: true,
  breaks: true
})

const showHelp = ref(false)
const showHelpText = ref(false)
const panelUrl = ref('')

const toggleHelp = () => {
  showHelp.value = !showHelp.value
}

setInterval(() => {
  showHelpText.value = !showHelpText.value
}, 3000)

const openPanelUrl = () => {
  if (panelUrl.value) {
    let url = panelUrl.value
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.float-button-wrapper {
  display: contents;
}

.float-button {
  width: 58px;
  height: 58px;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
}

.float-button__inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 215, 142, 0.9);
  border: 1px solid rgba(255, 153, 0, 0.28);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.58),
    inset 0 0 0 1px rgba(0, 0, 0, 0.24);
  transition:
    transform 0.24s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.24s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.24s ease,
    background 0.24s ease;
  overflow: hidden;
}

.help-button__inner {
  background:
    linear-gradient(
      160deg,
      rgba(255, 176, 62, 0.32) 0%,
      rgba(255, 153, 0, 0.2) 48%,
      rgba(255, 153, 0, 0.08) 100%
    ),
    rgba(10, 10, 10, 0.78);
}

.float-button:hover .float-button__inner {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 14px 26px rgba(0, 0, 0, 0.62),
    inset 0 0 0 1px rgba(0, 0, 0, 0.28);
}

.help-button:hover .help-button__inner {
  background:
    linear-gradient(
      160deg,
      rgba(255, 185, 78, 0.38) 0%,
      rgba(255, 165, 24, 0.24) 48%,
      rgba(255, 153, 0, 0.1) 100%
    ),
    rgba(12, 12, 12, 0.8);
}

.float-button:active .float-button__inner {
  transform: translateY(-1px) scale(0.95);
  transition-duration: 0.08s;
}

.float-button__icon {
  position: relative;
  z-index: 2;
}

.float-button__ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 183, 85, 0.26);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
}

.float-button:active .float-button__ripple {
  animation: ripple 0.55s ease-out;
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.65;
  }
  100% {
    transform: translate(-50%, -50%) scale(6.2);
    opacity: 0;
  }
}

.float-button-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.float-button-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.float-button-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.float-button-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.help-button-container {
  display: flex;
  align-items: center;
}

.help-text-container {
  height: 58px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin: 0 -10px;
}

.help-text {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 92%, #000000 8%), color-mix(in srgb, var(--bg-card) 86%, #000000 14%));
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--primary-color) 42%, var(--border-base));
  border-radius: 999px;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: color-mix(in srgb, var(--text-color) 88%, var(--primary-color) 12%);
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  margin-right: -58px;
  transform: translateX(100%);
  opacity: 0;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.42),
    inset 0 1px 1px rgba(255, 255, 255, 0.08);
  position: relative;
  backdrop-filter: blur(6px);
  isolation: isolate;
  overflow: hidden;
}

.help-text::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 12% 20%, rgba(255, 153, 0, 0.22), transparent 55%);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.75;
  pointer-events: none;
}

.help-text--show {
  transform: translateX(0);
  opacity: 1;
  margin-right: 16px;
}

@media (max-width: 768px) {
  .help-text-container {
    height: 52px;
  }
  .help-text {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .help-text-container {
    height: 48px;
  }
  .help-text {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
}

.help-modal {
  --modal-padding: clamp(16px, 2vw, 22px);
  --help-surface: color-mix(in srgb, var(--bg-card, #1a1a1a) 92%, #000000 8%);
  --help-border: color-mix(in srgb, var(--primary-color) 24%, rgba(255, 255, 255, 0.16));
  --help-border-soft: color-mix(in srgb, var(--primary-color) 12%, rgba(255, 255, 255, 0.14));
}

.help-modal--mobile {
  --modal-padding: 14px;
}

.help-modal :deep(.n-modal) {
  border-radius: 14px;
}

.help-modal--mobile :deep(.n-modal) {
  width: calc(100vw - 20px) !important;
  max-width: 560px !important;
  margin: 10px !important;
  border-radius: 12px !important;
}

.help-card {
  --n-padding-top: var(--modal-padding);
  --n-padding-bottom: var(--modal-padding);
  --n-padding-left: var(--modal-padding);
  --n-padding-right: var(--modal-padding);
  border: 1px solid var(--help-border);
  border-radius: 14px !important;
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.52),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  background: var(--n-color) !important;
  color: var(--n-text-color) !important;
}

.help-modal__header {
  margin: 0;
  padding: 0 0 12px;
  border-bottom: 1px solid var(--help-border-soft);
}

.help-modal__title {
  --n-margin: 0;
  --n-font-size: clamp(20px, 2.2vw, 24px);
  --n-text-color: rgba(255, 255, 255, 0.95);
  margin: 0;
  color: var(--n-text-color) !important;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.01em;
}

.help-modal__icon {
  color: var(--n-primary-color) !important;
  filter: drop-shadow(0 0 6px rgba(255, 153, 0, 0.32));
}

.help-modal__content {
  padding: 14px 0 0;
  max-height: min(56vh, 540px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.help-modal__content::-webkit-scrollbar {
  width: 8px;
}

.help-modal__content::-webkit-scrollbar-track {
  background: color-mix(in srgb, var(--bg-base, #000000) 86%, #000000);
}

.help-modal__content::-webkit-scrollbar-thumb {
  background: var(--n-scrollbar-color, rgba(128, 128, 128, 0.3)) !important;
  border-radius: 4px;
}

.help-modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--n-scrollbar-color-hover, rgba(128, 128, 128, 0.5)) !important;
}

.help-section {
  padding: 12px 0 0;
  margin: 12px 0 0;
  border-top: 1px dashed var(--help-border-soft);
}

.help-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.help-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.help-section__header::before {
  content: '';
  width: 3px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffbd4a 0%, #ff9900 100%);
}

.help-section :deep(h3) {
  --n-margin: 0;
  --n-font-size: 17px;
  margin: 0 !important;
  color: var(--n-text-color) !important;
  letter-spacing: 0.01em;
}

.markdown-content {
  color: color-mix(in srgb, var(--n-text-color) 82%, #ffffff 18%) !important;
  line-height: 1.75;
  font-size: 14px;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
  color: var(--n-text-color-2) !important;
}

.markdown-content :deep(p) {
  margin: 8px 0;
  color: var(--n-text-color-2) !important;
}

.markdown-content :deep(code) {
  background: var(--n-code-color, rgba(128, 128, 128, 0.12)) !important;
  color: var(--n-text-color) !important;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: var(--n-code-color, rgba(128, 128, 128, 0.12)) !important;
  color: var(--n-text-color) !important;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid var(--help-border-soft);
}

.markdown-content :deep(pre code) {
  background: none !important;
  color: inherit !important;
  padding: 0;
  border-radius: 0;
}

.markdown-content :deep(blockquote) {
  margin: 12px 0;
  padding-left: 16px;
  border-left: 4px solid var(--n-primary-color);
  color: var(--n-text-color-3) !important;
}

.markdown-content :deep(a) {
  color: var(--n-primary-color) !important;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.markdown-content :deep(a:hover) {
  opacity: 0.8;
}

.help-modal__footer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--help-border-soft);
}

.help-modal__footer-content {
  display: grid;
  gap: 12px;
  width: 100%;
}

.panel-link {
  display: grid;
  gap: 8px;
  padding: 12px;
  background: var(--help-surface);
  border-radius: 10px;
  border: 1px solid var(--help-border-soft);
}

.panel-link :deep(.n-text) {
  color: color-mix(in srgb, var(--n-text-color) 72%, #ffffff 28%) !important;
  font-size: 13px;
  letter-spacing: 0.01em;
}

.panel-link :deep(.n-input) {
  border-radius: 10px;
}

.panel-link :deep(.n-input__state-border) {
  border-radius: 10px;
}

.panel-link :deep(.n-button) {
  white-space: nowrap;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
}

.panel-input-group {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.panel-input {
  width: 100%;
  min-width: 0;
}

@media (max-width: 768px) {
  .help-modal__content {
    max-height: 52vh;
  }

  .help-section {
    padding: 12px 14px;
  }

  .help-modal__footer-content {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .help-modal--mobile :deep(.n-modal) {
    width: calc(100vw - 12px) !important;
    margin: 6px !important;
  }

  .help-modal__content {
    max-height: 48vh;
  }

  .panel-link {
    padding: 12px;
  }

  .panel-input-group {
    grid-template-columns: 1fr;
  }

.panel-input-group :deep(.n-button) {
    width: 100%;
  }
}

.help-modal__close-btn {
  min-width: 112px;
  font-weight: 500;
  align-self: flex-end;
  border-radius: 10px;
}

@media (max-width: 480px) {
  .help-modal__close-btn {
    width: 100%;
    align-self: stretch;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .float-button {
    width: 52px;
    height: 52px;
  }
  
  .float-button__icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .float-button {
    width: 48px;
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .float-button__inner,
  .float-button__icon,
  .float-button-fade-enter-active,
  .float-button-fade-leave-active {
    transition-duration: 0.1s;
  }
  
  .float-button__ripple {
    display: none;
  }
}
</style>
