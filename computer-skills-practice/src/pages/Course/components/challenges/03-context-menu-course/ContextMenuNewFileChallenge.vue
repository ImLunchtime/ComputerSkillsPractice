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
          <!-- 现有文件 -->
          <div class="file-item" v-for="file in existingFiles" :key="file.id">
            <div class="file-icon">{{ file.icon }}</div>
            <div class="file-name">{{ file.name }}</div>
          </div>
          
          <!-- 新创建的文件 -->
          <div v-if="newFile" class="file-item new-file">
            <div class="file-icon">📄</div>
            <div class="file-name">{{ newFile.name }}</div>
          </div>
          
          <!-- 空白提示 -->
          <div v-if="existingFiles.length === 0 && !newFile" class="empty-hint">
            右键点击空白区域创建新文档
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
        <div class="context-menu-item" @click="createNewFile">
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
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-6 text-center text-gray-500">
        <p>💡 提示：在文件管理器空白区域右键点击，选择"新建文档"</p>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你成功使用右键菜单创建了新文档</p>
    </div>
  </div>
</template>

<script setup>
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
const newFile = ref(null)

const existingFiles = ref([
  { id: 1, name: '这里什么都没有 真的.txt', icon: '📄' },
])

// 显示右键菜单
const showContextMenu = (event) => {
  event.preventDefault()
  showMenu.value = true
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

// 隐藏右键菜单
const hideContextMenu = () => {
  showMenu.value = false
}

// 创建新文件
const createNewFile = () => {
  newFile.value = {
    name: '新建文档.txt',
    icon: '📄'
  }
  hideContextMenu()
  
  // 延迟一下显示完成状态
  setTimeout(() => {
    completed.value = true
    emit('challenge-completed')
  }, 500)
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
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.file-manager-container {
  width: 600px;
  height: 400px;
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
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: #f3f4f6;
}

.file-item.new-file {
  background-color: #dbeafe;
  border: 2px dashed #3b82f6;
}

.file-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.file-name {
  font-size: 0.75rem;
  text-align: center;
  color: #374151;
  word-break: break-word;
}

.empty-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
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

.completion-animation {
  text-align: center;
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