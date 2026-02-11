<template>
  <div class="float-buttons">
    <!-- 返回顶部按钮 -->
    <transition name="back-to-top-fade">
      <div 
        v-show="show" 
        class="float-button back-to-top"
        @click="scrollToTop"
        role="button"
        aria-label="返回顶部"
      >
        <div class="float-button__inner back-to-top__inner">
          <n-icon size="22" class="float-button__icon">
            <chevron-up />
          </n-icon>
          <div class="float-button__ripple"></div>
        </div>
      </div>
    </transition>
    <submit-plugin-button />
    <help-button />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { NIcon } from 'naive-ui'
import { ChevronUp } from '@vicons/ionicons5'
import HelpButton from './HelpButton.vue'
import SubmitPluginButton from './SubmitPluginButton.vue'

const show = ref(false)
const scrollThreshold = 300

const checkScroll = () => {
  show.value = window.pageYOffset > scrollThreshold
}

const scrollToTop = () => {
  const currentPosition = window.pageYOffset
  const duration = 500 
  const startTime = performance.now()

  function animation(currentTime) {
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easing = progress => progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

    window.scrollTo(0, currentPosition * (1 - easing(progress)))

    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
  checkScroll() 
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.float-buttons {
  position: fixed;
  right: clamp(14px, 2.2vw, 26px);
  bottom: clamp(14px, 2.2vw, 26px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(12px, 1.8vw, 16px);
  z-index: 1100;
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

.back-to-top__inner {
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

.back-to-top:hover .back-to-top__inner {
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

.back-to-top:active .float-button__ripple {
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

.back-to-top-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.back-to-top-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.back-to-top-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.help-modal {
  max-width: 90vw;
}

.help-modal__title {
  margin: 0;
  color: var(--text-primary);
}

.help-section {
  padding: 8px 0;
}

.help-section :deep(h3) {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.help-section :deep(.n-text) {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .float-buttons {
    right: 20px;
    bottom: 20px;
    gap: 12px;
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
  .float-buttons {
    right: 16px;
    bottom: 16px;
    gap: 10px;
  }

  .float-button {
    width: 48px;
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .float-button__inner,
  .float-button__icon,
  .back-to-top-fade-enter-active,
  .back-to-top-fade-leave-active {
    transition-duration: 0.1s;
  }
  
  .float-button__ripple {
    display: none;
  }
  
  @keyframes float {
    0%, 100% {
      transform: none;
    }
  }
}
</style>
