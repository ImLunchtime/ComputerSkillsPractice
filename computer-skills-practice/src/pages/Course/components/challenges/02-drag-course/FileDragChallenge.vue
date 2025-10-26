<template>
  <div class="challenge-container">
    <div v-if="!completed" class="drag-challenge">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-8">{{ challenge.description }}</p>
      
      <!-- 拖拽区域 -->
      <div class="flex items-center justify-center gap-12 mb-8">
        <!-- 左侧容器 -->
        <div class="drag-container source-container">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">源文件夹</h3>
          <div 
            class="container-box"
            :class="{ 'drag-over': isDragOver }"
          >
            <div 
              v-if="!fileDragged"
              class="file-item"
              draggable="true"
              @dragstart="onDragStart"
              @dragend="onDragEnd"
            >
              <div class="file-icon">📄</div>
              <div class="file-name">拖拽练习.txt</div>
            </div>
            <div v-else class="empty-message">
              文件已移动
            </div>
          </div>
        </div>
        
        <!-- 右侧容器 -->
        <div class="drag-container target-container">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">目标文件夹</h3>
          <div 
            class="container-box"
            :class="{ 'drag-over': isDragOverTarget, 'has-file': fileDragged }"
            @dragover.prevent="onDragOverTarget"
            @dragleave="onDragLeaveTarget"
            @drop="onDrop"
          >
            <div v-if="fileDragged" class="file-item">
              <div class="file-icon">📄</div>
              <div class="file-name">拖拽练习.txt</div>
            </div>
            <div v-else class="drop-message">
              将文件拖拽到这里
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="text-center text-gray-500">
        <p>💡 提示：点击并拖拽左侧的文件到右侧容器中</p>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你成功完成了文件拖拽操作</p>
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
const fileDragged = ref(false)
const isDragOver = ref(false)
const isDragOverTarget = ref(false)

// 拖拽开始
const onDragStart = (event) => {
  event.dataTransfer.setData('text/plain', 'file')
  event.dataTransfer.effectAllowed = 'move'
}

// 拖拽结束
const onDragEnd = () => {
  isDragOver.value = false
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
  
  const data = event.dataTransfer.getData('text/plain')
  if (data === 'file') {
    fileDragged.value = true
    
    // 延迟显示完成状态
    setTimeout(() => {
      completed.value = true
      emit('challenge-completed')
    }, 500)
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
  max-width: 800px;
}

.drag-container {
  text-align: center;
}

.container-box {
  width: 200px;
  height: 150px;
  border: 3px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  position: relative;
}

.container-box.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.container-box.has-file {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.file-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.file-item:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.file-icon {
  font-size: 2rem;
  margin-bottom: 4px;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

.drop-message {
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
}

.empty-message {
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
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