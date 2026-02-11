<template>
  <n-layout class="main-layout">
    <app-header
      v-model:search-query="searchQuery"
      v-model:selected-tag="selectedTag"
      v-model:current-page="currentPage"
      v-model:sort-by="sortBy"
      :tag-options="tagOptions"
      :total-pages="totalPages"
    />

    <!-- 随机排序时的工具条 -->
    <div v-if="sortBy === 'random'" class="grid-toolbar">
      <div class="grid-toolbar-inner">
        <span class="toolbar-tip">随机推荐</span>
        <n-button size="small" tertiary @click="refreshRandomOrder">
          <template #icon>
                         <n-icon><sync-outline /></n-icon>
          </template>
          换一换
        </n-button>
      </div>
    </div>

    <main class="plugins-grid">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <div class="custom-loading">
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <div class="loading-text">正在加载插件数据</div>
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <div v-else-if="!isLoading && filteredPlugins.length === 0" class="empty-state">
        <div class="empty-icon">
          <n-icon size="48" :component="SearchOutline" />
        </div>
        <h3 class="empty-title">没有找到相关插件哦</h3>
        <p class="empty-description">
          <span v-if="searchQuery || selectedTag">
            试试调整搜索内容呢
          </span>
          <span v-else>
            当前没有可用的插件数据
          </span>
        </p>
      </div>
      
      <!-- 插件卡片 -->
      <template v-else>
        <plugin-card
          v-for="(plugin, index) in paginatedPlugins"
          :key="`${plugin.id || plugin.name}-${filterKey}-${randomSeed}`"
          :plugin="plugin"
          :index="index"
          :seed="randomSeed"
        />
      </template>
    </main>
    <div class="bottom-pagination-wrapper">
      <app-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <app-footer />
  </n-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { NLayout, NSpin, NIcon, NButton } from 'naive-ui'
import { SearchOutline, SyncOutline } from '@vicons/ionicons5'
import AppHeader from '../components/AppHeader.vue'
import PluginCard from '../components/PluginCard.vue'
import AppPagination from '../components/AppPagination.vue'
import AppFooter from '../components/AppFooter.vue'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()
const {
  searchQuery,
  selectedTag,
  currentPage,
  sortBy,
  tagOptions,
  totalPages,
  paginatedPlugins,
  isLoading,
  filteredPlugins,
  randomSeed
} = storeToRefs(store)

const filterKey = computed(() => {
  return `${searchQuery.value}-${selectedTag.value}-${sortBy.value}-${currentPage.value}`
})

const { refreshRandomOrder } = store
onMounted(() => {
  store.loadPlugins()
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  --home-max-width: 1400px;
  --home-gutter: clamp(12px, 2.2vw, 24px);
  background:
    radial-gradient(circle at 14% -8%, rgba(255, 153, 0, 0.09), transparent 42%),
    radial-gradient(circle at 90% 12%, rgba(255, 153, 0, 0.05), transparent 36%),
    linear-gradient(180deg, var(--bg-base), var(--bg-base));
}

.bottom-pagination-wrapper {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 var(--home-gutter);
  box-sizing: border-box;
}

.bottom-pagination-wrapper:empty {
  display: none;
}

.grid-toolbar {
  width: 100%;
  max-width: var(--home-max-width);
  margin: 0 auto;
  padding: 0 var(--home-gutter);
  box-sizing: border-box;
}

.grid-toolbar-inner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--border-base);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(6px);
}

.toolbar-tip {
  color: var(--text-secondary);
  font-size: 13px;
  opacity: 0.9;
  letter-spacing: 0.02em;
}

.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  width: 100%;
  max-width: var(--home-max-width);
  gap: clamp(16px, 2vw, 24px);
  padding: 12px var(--home-gutter) 24px;
  margin: 0 auto;
  box-sizing: border-box;
  animation: gridAppear 0.3s ease-out;
  animation-delay: 0.7s;
  animation-fill-mode: backwards;
  align-content: start;
  align-items: stretch;
}

@keyframes gridAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 平板和中等屏幕 */
@media (max-width: 1024px) and (min-width: 769px) {
  .plugins-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding-top: 10px;
  }
}

/* 小平板屏幕 */
@media (max-width: 768px) and (min-width: 481px) {
  .plugins-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
    padding-top: 8px;
  }
}

/* 手机屏幕 */
@media (max-width: 480px) {
  .plugins-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 8px;
  }
}

.plugins-grid > * {
  max-width: none;
  width: 100%;
  justify-self: stretch;
}

.loading-container {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52vh;
  padding: 20px 0;
}

.custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 28px 32px;
  border: 1px solid var(--border-base);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(6px);
}

.loading-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: dotPulse 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.8;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.9;
  }
}

.loading-container :deep(.n-spin) {
  will-change: transform;
  transform: translateZ(0); 
}

.loading-container :deep(.n-spin-icon) {
  animation-timing-function: linear !important;
  animation-duration: 1s !important; 
  will-change: transform;
  transform: translateZ(0); 
}

.loading-container :deep(.n-spin-body) {
  will-change: auto;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 40px 24px;
  text-align: center;
  color: var(--text-color-2);
  border: 1px solid var(--border-base);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
  color: var(--text-color-3);
}

.empty-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color-1);
}

.empty-description {
  margin: 0;
  font-size: 14px;
  color: var(--text-color-2);
  opacity: 0.8;
}
</style>
