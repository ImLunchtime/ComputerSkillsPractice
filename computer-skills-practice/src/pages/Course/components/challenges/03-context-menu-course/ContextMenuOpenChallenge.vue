<template>
  <div class="challenge-container">
    <div v-if="!completed" class="context-menu-challenge">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-8">{{ challenge.description }}</p>
      
      <!-- 文件管理器界面 -->
      <div class="file-manager-container">
        <div class="file-manager-header">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="text-sm text-gray-600 font-medium">文件管理器</div>
          <div></div>
        </div>
        
        <div class="file-manager-toolbar">
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span>📁 此电脑</span>
            <span>/</span>
            <span>桌面</span>
          </div>
        </div>
        
        <div 
          class="file-manager-content"
          @contextmenu.prevent="showContextMenu"
          @click="hideContextMenu"
        >
          <div 
            v-for="file in files" 
            :key="file.id"
            class="file-item"
            :class="{ 'selected': selectedFile?.id === file.id, 'target-file': file.isTarget }"
            @click="selectFile(file)"
            @contextmenu.prevent.stop="showFileContextMenu($event, file)"
            @dblclick="alert('不要双击打开文件哦~')"
          >
            <div class="file-icon">{{ file.icon }}</div>
            <div class="file-name">{{ file.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- 自定义右键菜单 -->
      <div 
        v-if="showMenu" 
        class="context-menu"
        :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
        @click.stop
      >
        <template v-if="menuType === 'file'">
          <div 
            class="context-menu-item"
            :class="{ 'highlight': selectedFile?.isTarget }"
            @click="openFile(selectedFile)"
          >
            <span class="menu-icon">📂</span>
            <span>打开</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">📋</span>
            <span>复制</span>
          </div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">✂️</span>
            <span>剪切</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">🗑️</span>
            <span>删除</span>
          </div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">✏️</span>
            <span>重命名</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">ℹ️</span>
            <span>属性</span>
          </div>
        </template>
        
        <template v-else>
          <div class="context-menu-item disabled">
            <span class="menu-icon">📄</span>
            <span>新建文档</span>
          </div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">📁</span>
            <span>新建文件夹</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">📋</span>
            <span>粘贴</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item disabled">
            <span class="menu-icon">🔄</span>
            <span>刷新</span>
          </div>
        </template>
      </div>
      
      <!-- 文件打开模拟窗口 -->
      <div v-if="openedFile" class="file-window-overlay" @click="closeFile">
        <div class="file-window" @click.stop>
          <div class="file-window-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full cursor-pointer" @click="closeFile"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">{{ openedFile.name }}</div>
            <div></div>
          </div>
          
          <div class="file-window-content">
            <div class="file-preview">
              <div class="file-icon-large">🎉</div>
              <h3 class="text-xl font-bold text-green-600 mb-2">恭喜你！</h3>
              <p class="text-gray-600">你成功使用右键菜单打开了文件！</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-6 text-center text-gray-500">
        <p v-if="!fileOpened">💡 提示：右键点击高亮的"练习文档.txt"文件，选择"打开"</p>
        <p v-else class="text-green-600">✅ 文件打开成功！</p>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你成功使用右键菜单打开了文件</p>
    </div>
  </div>
</template>

<script setup>
import { IconAddAlert } from '@iconify-prerendered/vue-material-symbols'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const menuType = ref('blank') // 'file' or 'blank'
const selectedFile = ref(null)
const openedFile = ref(null)
const fileOpened = ref(false)

const files = ref([
  { 
    id: 1, 
    name: '练习文档.txt', 
    icon: '📄',
    type: '文本文档',
    size: '2.5 KB',
    modifiedTime: '2024-01-16 14:20',
    description: '这是一个用于练习的文本文档，包含了一些示例内容。',
    isTarget: true
  }
])

// 选择文件
const selectFile = (file) => {
  selectedFile.value = file
}

// 显示空白区域右键菜单
const showContextMenu = (event) => {
  event.preventDefault()
  showMenu.value = true
  menuType.value = 'blank'
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

// 显示文件右键菜单
const showFileContextMenu = (event, file) => {
  event.preventDefault()
  showMenu.value = true
  menuType.value = 'file'
  selectedFile.value = file
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

// 隐藏右键菜单
const hideContextMenu = () => {
  showMenu.value = false
}

// 打开文件
const openFile = (file) => {
  if (!file) return
  
  openedFile.value = file
  hideContextMenu()
  
  if (file.isTarget) {
    fileOpened.value = true
    
    // 立即标记为完成
    setTimeout(() => {
      completed.value = true
      emit('challenge-completed')
    }, 1000)
  }
}

// 关闭文件
const closeFile = () => {
  openedFile.value = null
}

// 全局点击事件监听
const handleGlobalClick = (event) => {
  if (!event.target.closest('.context-menu')) {
    hideContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.challenge-container {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.file-manager-container {
  width: 700px;
  height: 450px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.file-manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.file-manager-toolbar {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.file-manager-content {
  padding: 1rem;
  height: calc(100% - 120px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  align-content: start;
  position: relative;
  cursor: default;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.file-item:hover {
  background-color: #f3f4f6;
}

.file-item.selected {
  background-color: #dbeafe;
  border: 2px solid #3b82f6;
}

.file-item.target-file {
  background-color: #fef3c7;
  border: 2px dashed #f59e0b;
  animation: pulse 2s infinite;
}

.file-item.target-file.selected {
  background-color: #fbbf24;
  border: 2px solid #f59e0b;
}

.file-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.file-name {
  font-size: 0.75rem;
  text-align: center;
  color: #374151;
  word-break: break-word;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  padding: 0.25rem 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.context-menu-item:hover:not(.disabled) {
  background-color: #f3f4f6;
}

.context-menu-item.highlight {
  background-color: #fef3c7;
  font-weight: 600;
}

.context-menu-item.highlight:hover {
  background-color: #fbbf24;
}

.context-menu-item.disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.menu-icon {
  margin-right: 0.5rem;
  width: 1rem;
  text-align: center;
}

.context-menu-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.25rem 0;
}

.file-window-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.file-window {
  width: 500px;
  height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.file-window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.file-window-content {
  padding: 2rem;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.file-preview {
  text-align: center;
}

.file-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.file-details {
  background: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #374151;
}

.detail-value {
  color: #6b7280;
}

.completion-animation {
  text-align: center;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>