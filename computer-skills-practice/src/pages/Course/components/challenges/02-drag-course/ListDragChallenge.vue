<template>
  <div class="challenge-container">
    <div v-if="!completed" class="drag-challenge">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-8">{{ challenge.description }}</p>
      
      <!-- 拖拽区域 -->
      <div class="flex items-start justify-center gap-12 mb-8">
        <!-- 左侧文件列表 -->
        <div class="drag-container source-container">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">文件管理器</h3>
          <div class="file-list-container">
            <!-- 列表头部 -->
            <div class="list-header">
              <div class="header-cell name-header">名称</div>
              <div class="header-cell size-header">体积</div>
              <div class="header-cell date-header">修改日期</div>
            </div>
            
            <!-- 文件列表 -->
            <div class="file-list">
              <div 
                v-for="file in files" 
                :key="file.id"
                class="file-row"
                :class="{ 
                  'dragged': file.dragged, 
                  'target-file': file.name === '我的世界.exe',
                  'bounce-back': file.bouncing
                }"
                :draggable="!file.dragged"
                @dragstart="onDragStart($event, file)"
                @dragend="onDragEnd"
              >
                <div class="file-cell name-cell">
                  <span class="file-icon">🎮</span>
                  <span class="file-name">{{ file.name }}</span>
                </div>
                <div class="file-cell size-cell">{{ file.size }}</div>
                <div class="file-cell date-cell">{{ file.date }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧目标容器 -->
        <div class="drag-container target-container">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">目标文件夹</h3>
          <div 
            class="target-list-container"
            :class="{ 'drag-over': isDragOverTarget, 'has-file': targetFile }"
            @dragover.prevent="onDragOverTarget"
            @dragleave="onDragLeaveTarget"
            @drop="onDrop"
          >
            <!-- 目标列表头部 -->
            <div class="list-header">
              <div class="header-cell name-header">名称</div>
              <div class="header-cell size-header">体积</div>
              <div class="header-cell date-header">修改日期</div>
            </div>
            
            <!-- 目标文件列表 -->
            <div class="file-list">
              <div v-if="targetFile" class="file-row">
                <div class="file-cell name-cell">
                  <span class="file-icon">🎮</span>
                  <span class="file-name">{{ targetFile.name }}</span>
                </div>
                <div class="file-cell size-cell">{{ targetFile.size }}</div>
                <div class="file-cell date-cell">{{ targetFile.date }}</div>
              </div>
              <div v-else class="empty-list">
                <div class="drop-message">将"我的世界"拖拽到这里</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="text-center text-gray-500">
        <p>💡 提示：找到"我的世界"文件，将其拖拽到右侧的目标文件夹中</p>
        <p class="text-sm mt-2 text-gray-400">其他文件也可以拖拽，但只有"我的世界"才能成功放置</p>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你成功完成了列表拖拽操作</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const isDragOverTarget = ref(false)
const targetFile = ref(null)

// 文件列表数据
const files = ref([
  {
    id: 1,
    name: '我的世界.exe',
    size: '1.1 GB',
    date: '2011-05-24',
    dragged: false,
    bouncing: false
  },
  {
    id: 2,
    name: '三角洲行动.exe',
    size: '87.5 GB',
    date: '2025-07-02',
    dragged: false,
    bouncing: false
  },
  {
    id: 3,
    name: '原神.exe',
    size: '187 GB',
    date: '2025-07-13',
    dragged: false,
    bouncing: false
  },
  {
    id: 4,
    name: '绝区零.exe',
    size: '144 GB',
    date: '2025-08-05',
    dragged: false,
    bouncing: false
  },
  {
    id: 5,
    name: '极限竞速·地平线4.exe',
    size: '98.7 GB',
    date: '2023-08-03',
    dragged: false,
    bouncing: false
  }
])

// 拖拽开始
const onDragStart = (event, file) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(file))
  event.dataTransfer.effectAllowed = 'move'
}

// 拖拽结束
const onDragEnd = () => {
  // 拖拽结束时的处理
}

// 拖拽到目标容器上方
const onDragOverTarget = (event) => {
  event.preventDefault()
  isDragOverTarget.value = true
}

// 离开目标容器
const onDragLeaveTarget = () => {
  isDragOverTarget.value = false
}

// 放置文件
const onDrop = (event) => {
  event.preventDefault()
  isDragOverTarget.value = false
  
  try {
    const fileData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    if (fileData.name === '我的世界.exe') {
      // 正确的文件 - 完成挑战
      const sourceFile = files.value.find(f => f.id === fileData.id)
      if (sourceFile) {
        sourceFile.dragged = true
      }
      
      // 设置目标文件
      targetFile.value = { ...fileData }
      
      // 延迟显示完成状态
      setTimeout(() => {
        completed.value = true
        emit('challenge-completed')
      }, 500)
    } else {
      // 错误的文件 - 弹回动画
      const sourceFile = files.value.find(f => f.id === fileData.id)
      if (sourceFile) {
        sourceFile.bouncing = true
        
        // 1秒后移除弹回效果
        setTimeout(() => {
          sourceFile.bouncing = false
        }, 1000)
      }
    }
  } catch (error) {
    console.error('拖拽数据解析失败:', error)
  }
}
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

.drag-challenge {
  width: 100%;
  max-width: 900px;
}

.drag-container {
  text-align: center;
}

.file-list-container,
.target-list-container {
  width: 350px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  transition: all 0.3s ease;
}

.target-list-container.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.target-list-container.has-file {
  border-color: #10b981;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.header-cell {
  padding: 12px 8px;
  text-align: left;
  border-right: 1px solid #e5e7eb;
}

.header-cell:last-child {
  border-right: none;
}

.file-list {
  min-height: 200px;
}

.file-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
  cursor: grab;
}

.file-row:hover {
  background-color: #f0f9ff;
}

.file-row:active {
  cursor: grabbing;
}

.file-row.target-file {
  cursor: grab;
}

.file-row.target-file:hover {
  background-color: #ecfdf5;
  border-left: 3px solid #10b981;
}

.file-row.dragged {
  opacity: 0.5;
  background-color: #f9fafb;
  cursor: not-allowed;
}

.file-row.bounce-back {
  animation: bounceBack 1s ease-in-out;
  background-color: #fef2f2;
  border-left: 3px solid #ef4444;
}

.file-cell {
  padding: 12px 8px;
  text-align: left;
  border-right: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
}

.file-cell:last-child {
  border-right: none;
}

.name-cell {
  display: flex;
  align-items: center;
}

.file-icon {
  margin-right: 8px;
  font-size: 1rem;
}

.file-name {
  font-weight: 500;
}

.empty-list {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-message {
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
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

@keyframes bounceBack {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(10px) scale(1.05);
  }
  50% {
    transform: translateX(-5px) scale(1.02);
  }
  75% {
    transform: translateX(3px) scale(1.01);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>