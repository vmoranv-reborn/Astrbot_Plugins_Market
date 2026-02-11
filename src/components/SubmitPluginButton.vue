<template>
  <div class="submit-button-container" @mouseenter="showTipText = true" @mouseleave="showTipText = false">
    <div class="text-container">
      <div class="tip-text" :class="{ 'tip-text--show': showTipText }">
        来提交你的插件吧！
      </div>
    </div>
    <div class="float-button submit-plugin">
      <div 
        class="float-button__inner submit-plugin__inner"
        @click="navigateToSubmit"
        role="button"
        aria-label="提交插件"
      >
        <n-icon size="22" class="float-button__icon">
          <add-circle />
        </n-icon>
        <div class="float-button__ripple"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NIcon } from 'naive-ui'
import { AddCircle } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()
const showTipText = ref(false)

const navigateToSubmit = () => {
  router.push('/submit')
}
</script>

<style scoped>
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

.float-button:hover .float-button__inner {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 14px 26px rgba(0, 0, 0, 0.62),
    inset 0 0 0 1px rgba(0, 0, 0, 0.28);
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

.submit-button-container {
  display: flex;
  align-items: center;
}

.text-container {
  height: 58px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin: 0 -10px;
}

.tip-text {
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

.tip-text::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 12% 20%, rgba(255, 153, 0, 0.22), transparent 55%);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.75;
  pointer-events: none;
}

.tip-text--show {
  transform: translateX(0);
  opacity: 1;
  margin-right: 16px;
}

.submit-plugin__inner {
  background:
    linear-gradient(
      160deg,
      rgba(255, 176, 62, 0.32) 0%,
      rgba(255, 153, 0, 0.2) 48%,
      rgba(255, 153, 0, 0.08) 100%
    ),
    rgba(10, 10, 10, 0.78);
}

.submit-plugin:hover .submit-plugin__inner {
  background:
    linear-gradient(
      160deg,
      rgba(255, 185, 78, 0.38) 0%,
      rgba(255, 165, 24, 0.24) 48%,
      rgba(255, 153, 0, 0.1) 100%
    ),
    rgba(12, 12, 12, 0.8);
}

.submit-plugin:active .float-button__ripple {
  animation: ripple 0.55s ease-out;
}

@media (max-width: 768px) {
  .text-container {
    height: 52px;
  }
  .tip-text {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
  .float-button {
    width: 52px;
    height: 52px;
  }
  
  .float-button__icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .text-container {
    height: 48px;
  }
  .tip-text {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
  .float-button {
    width: 48px;
    height: 48px;
  }
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

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.submit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.json-section {
  margin-top: 24px;
}

.json-tip {
  margin-bottom: 12px;
}

.json-textarea {
  margin-bottom: 12px;
}

.json-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

:deep(.n-input) {
  width: 100%;
}

:deep(.n-form-item) {
  margin-bottom: 24px;
}

:deep(.n-card-header) {
  padding-bottom: 16px;
  flex-shrink: 0;
}

:deep(.n-card__content) {
  flex: 1;
  padding-right: -8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .submit-modal {
    max-width: 90vw;
  }
}
</style>
