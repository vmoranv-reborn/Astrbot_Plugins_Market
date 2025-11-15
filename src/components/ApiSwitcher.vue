<template>
  <div class="api-switcher">
    <div class="api-switcher-container" @click="toggleDropdown">
      <div class="current-api">
        <n-icon class="api-icon">
          <server-outline />
        </n-icon>
        <span class="api-name">{{ currentApi.name }}</span>
        <n-icon class="dropdown-icon" :class="{ 'is-open': isDropdownOpen }">
          <chevron-down-outline />
        </n-icon>
      </div>
    </div>
    
    <!-- 虹膜动画遮罩 -->
    <div class="iris-mask" :class="{ 'is-active': isAnimating }" ref="irisMask">
      <div class="iris-content"></div>
    </div>
    
    <!-- 下拉菜单 -->
    <transition name="dropdown">
      <div v-if="isDropdownOpen" class="api-dropdown" ref="dropdown">
        <div
          v-for="(api, index) in apiEndpoints"
          :key="index"
          class="api-option"
          :class="{ 'is-active': index === currentApiIndex }"
          @click="selectApi(index, $event)"
        >
          <n-icon class="api-option-icon">
            <server-outline />
          </n-icon>
          <span class="api-option-name">{{ api.name }}</span>
          <n-icon v-if="index === currentApiIndex" class="check-icon">
            <checkmark-outline />
          </n-icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { NIcon } from 'naive-ui'
import { ServerOutline, ChevronDownOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()
const { currentApi, currentApiIndex } = storeToRefs(store)
const { switchApi } = store

// 直接获取apiEndpoints以确保响应性
const apiEndpoints = computed(() => store.apiEndpoints)

const isDropdownOpen = ref(false)
const isAnimating = ref(false)
const dropdown = ref(null)
const irisMask = ref(null)

function toggleDropdown(event) {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

function selectApi(index, event) {
  event.stopPropagation()
  if (index !== currentApiIndex.value) {
    // 触发虹膜动画
    triggerIrisAnimation(() => {
      switchApi(index)
      isDropdownOpen.value = false
    })
  } else {
    isDropdownOpen.value = false
  }
}

function triggerIrisAnimation(callback) {
  isAnimating.value = true
  
  // 获取点击位置或使用屏幕中心
  const x = window.innerWidth / 2
  const y = window.innerHeight / 2
  
  if (irisMask.value) {
    // 设置虹膜遮罩的起始位置
    irisMask.value.style.setProperty('--iris-x', `${x}px`)
    irisMask.value.style.setProperty('--iris-y', `${y}px`)
  }
  
  // 动画完成后执行回调
  setTimeout(() => {
    callback()
    setTimeout(() => {
      isAnimating.value = false
    }, 300)
  }, 600)
}

// 点击外部关闭下拉菜单
function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.api-switcher {
  position: relative;
  z-index: 1000;
}

.api-switcher-container {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-base);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.api-switcher-container:hover {
  background: var(--bg-hover);
  border-color: var(--primary-color);
}

.current-api {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.api-icon {
  color: var(--primary-color);
  font-size: 16px;
}

.api-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  color: var(--text-secondary);
  font-size: 14px;
  transition: transform 0.2s ease;
}

.dropdown-icon.is-open {
  transform: rotate(180deg);
}

/* 虹膜动画遮罩 */
.iris-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.iris-mask.is-active {
  opacity: 1;
  visibility: visible;
  animation: irisAnimation 0.9s ease-in-out;
}

.iris-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--body-color);
  transform-origin: var(--iris-x, 50%) var(--iris-y, 50%);
}

@keyframes irisAnimation {
  0% {
    clip-path: circle(0% at var(--iris-x, 50%) var(--iris-y, 50%));
  }
  50% {
    clip-path: circle(150% at var(--iris-x, 50%) var(--iris-y, 50%));
  }
  100% {
    clip-path: circle(0% at var(--iris-x, 50%) var(--iris-y, 50%));
  }
}

/* 下拉菜单 */
.api-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-base);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
  min-width: 140px;
}

.api-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.api-option:hover {
  background: var(--bg-hover);
}

.api-option.is-active {
  background: var(--primary-color);
  opacity: 0.1;
}

.api-option-icon {
  color: var(--text-secondary);
  font-size: 16px;
}

.api-option.is-active .api-option-icon {
  color: var(--primary-color);
}

.api-option-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.check-icon {
  color: var(--primary-color);
  font-size: 16px;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}

/* 深色主题适配 */
:global(.dark) .iris-content {
  background: var(--body-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .api-switcher-container {
    min-width: 120px;
    padding: 6px 10px;
  }
  
  .api-name {
    font-size: 13px;
  }
  
  .api-icon,
  .dropdown-icon,
  .api-option-icon,
  .check-icon {
    font-size: 14px;
  }
  
  .api-option {
    padding: 8px 10px;
  }
  
  .api-option-name {
    font-size: 13px;
  }
}
</style>