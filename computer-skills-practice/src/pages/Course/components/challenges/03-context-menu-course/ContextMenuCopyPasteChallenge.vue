<template>
  <div class="challenge-container">
    <div v-if="!completed" class="context-menu-challenge">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-8">{{ challenge.description }}</p>
      
      <!-- 双文件管理器界面 -->
      <div class="dual-file-manager">
        <!-- 左侧文件管理器 -->
        <div class="file-manager-container">
          <div class="file-manager-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">源文件夹</div>
            <div></div>
          </div>
          
          <div class="file-manager-toolbar">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>📁 此电脑</span>
              <span>/</span>
              <span>源文件夹</span>
            </div>
          </div>
          
          <div 
            class="file-manager-content"
            @contextmenu.prevent="showContextMenu($event, 'source')"
            @click="hideContextMenu"
          >
            <div 
              v-for="file in sourceFiles" 
              :key="file.id"
              class="file-item"
              :class="{ 'selected': selectedFile?.id === file.id }"
              @click="selectFile(file)"
              @contextmenu.prevent.stop="showFileContextMenu($event, file, 'source')"
            >
              <div class="file-icon">{{ file.icon }}</div>
              <div class="file-name">{{ file.name }}</div>
            </div>
          </div>
        </div>
        
        <!-- 右侧文件管理器 -->
        <div class="file-manager-container">
          <div class="file-manager-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">U盘</div>
            <div></div>
          </div>
          
          <div class="file-manager-toolbar">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>📁 此电脑</span>
              <span>/</span>
              <span>U盘</span>
            </div>
          </div>
          
          <div 
            class="file-manager-content"
            @contextmenu.prevent="showContextMenu($event, 'target')"
            @click="hideContextMenu"
          >
            <div 
              v-for="file in targetFiles" 
              :key="file.id"
              class="file-item"
            >
              <div class="file-icon">{{ file.icon }}</div>
              <div class="file-name">{{ file.name }}</div>
            </div>
            
            <div v-if="targetFiles.length === 0" class="empty-hint">
              右键点击空白区域粘贴文件
            </div>
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
        <!-- 文件右键菜单 -->
        <template v-if="menuType === 'file'">
          <div class="context-menu-item" @click="copyFile">
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
        </template>
        
        <!-- 空白区域右键菜单 -->
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
          <div 
            class="context-menu-item"
            :class="{ disabled: !copiedFile || currentManager !== 'target' }"
            @click="pasteFile"
          >
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
      
      <!-- 提示信息 -->
      <div class="mt-6 text-center text-gray-500">
        <p v-if="!copiedFile">💡 提示：右键点击左侧文件，选择"复制"</p>
        <p v-else-if="!filePasted">💡 提示：在右侧空白区域右键点击，选择"粘贴"</p>
        <p v-else class="text-green-600">✅ 文件复制成功！</p>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你成功使用右键菜单复制并粘贴了文件</p>
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
const menuType = ref('blank') // 'file' or 'blank'
const currentManager = ref('') // 'source' or 'target'
const selectedFile = ref(null)
const copiedFile = ref(null)
const filePasted = ref(false)

const sourceFiles = ref([
  { id: 1, name: '机密行动资料.pdf', icon: '📄' },
])

const targetFiles = ref([])

// 选择文件
const selectFile = (file) => {
  selectedFile.value = file
}

// 显示空白区域右键菜单
const showContextMenu = (event, manager) => {
  event.preventDefault()
  showMenu.value = true
  menuType.value = 'blank'
  currentManager.value = manager
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

// 显示文件右键菜单
const showFileContextMenu = (event, file, manager) => {
  event.preventDefault()
  showMenu.value = true
  menuType.value = 'file'
  currentManager.value = manager
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

// 复制文件
const copyFile = () => {
  if (selectedFile.value) {
    copiedFile.value = { ...selectedFile.value }
    hideContextMenu()
  }
}

// 粘贴文件
const pasteFile = () => {
  if (copiedFile.value && currentManager.value === 'target') {
    // 创建新的文件ID避免冲突
    const newFile = {
      ...copiedFile.value,
      id: Date.now()
    }
    targetFiles.value.push(newFile)
    filePasted.value = true
    hideContextMenu()
    
    // 延迟一下显示完成状态
    setTimeout(() => {
      completed.value = true
      emit('challenge-completed')
    }, 1000)
  }
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

.dual-file-manager {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.file-manager-container {
  flex: 1;
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
  user-select: none;
}

.file-item:hover {
  background-color: #f3f4f6;
}

.file-item.selected {
  background-color: #dbeafe;
  border: 2px solid #3b82f6;
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