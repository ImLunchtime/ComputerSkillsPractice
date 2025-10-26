<template>
  <div class="challenge-container">
    <div v-if="!completed" class="shortcut-challenge">
      <!-- 文本编辑器窗口 -->
      <div class="editor-container">
        <!-- 左侧编辑器 -->
        <div class="editor-window">
          <div class="editor-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">《难得真兄弟》歌词.txt</div>
            <div></div>
          </div>
          
          <div class="editor-content">
            <textarea
              ref="sourceTextarea"
              v-model="sourceText"
              class="editor-textarea"
              placeholder="这里是源文本..."
              readonly
              @contextmenu.prevent
            ></textarea>
          </div>
        </div>
        
        <!-- 箭头指示 -->
        <div class="arrow-container">
          <div class="arrow">→</div>
          <div class="shortcut-hint">点击文本 → Ctrl+A → Ctrl+C → Ctrl+V</div>
        </div>
        
        <!-- 右侧编辑器 -->
        <div class="editor-window">
          <div class="editor-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">TM邮箱 - 发给 同学 的消息</div>
            <div></div>
          </div>
          
          <div class="editor-content">
            <textarea
              ref="targetTextarea"
              v-model="targetText"
              class="editor-textarea"
              placeholder="请使用 Ctrl+A 全选，然后 Ctrl+C 复制，最后 Ctrl+V 粘贴到这里..."
              @contextmenu.prevent
              @keydown="handleKeydown"
              @paste="handlePaste"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- 进度指示器 -->
      <div class="progress-container mt-6">
        <div class="progress-step" :class="{ 'completed': true }">
          <div class="step-number">1</div>
          <div class="step-text">点击文本 确定选择范围</div>
        </div>
        <div class="progress-step" :class="{ 'completed': selectAllDetected }">
          <div class="step-number">2</div>
          <div class="step-text">Ctrl+A 全选</div>
        </div>
        <div class="progress-arrow">→</div>
        <div class="progress-step" :class="{ 'completed': copyDetected }">
          <div class="step-number">3</div>
          <div class="step-text">Ctrl+C 复制</div>
        </div>
        <div class="progress-arrow">→</div>
        <div class="progress-step" :class="{ 'completed': pasteDetected }">
          <div class="step-number">4</div>
          <div class="step-text">Ctrl+V 粘贴</div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-6 text-center">
        <div v-if="!selectAllDetected" class="text-gray-500">
          <p>💡 提示：点击左侧文本框，然后按 <kbd>Ctrl+A</kbd> 全选所有文本</p>
        </div>
        <div v-else-if="selectAllDetected && !copyDetected" class="text-blue-600">
          <p>✅ 全选成功！现在按 <kbd>Ctrl+C</kbd> 复制选中的文本</p>
        </div>
        <div v-else-if="copyDetected && !pasteDetected" class="text-orange-600">
          <p>✅ 复制成功！现在点击右侧文本框，按 <kbd>Ctrl+V</kbd> 粘贴</p>
        </div>
        <div v-else-if="pasteDetected" class="text-green-600">
          <p>🎉 完美！你已经掌握了全选、复制、粘贴的完整操作流程！</p>
        </div>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🏆</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你已经熟练掌握了快捷键的组合使用</p>
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
const sourceText = ref('难得有几个真兄弟\n不散的情谊\n虽然很久不曾联系\n但是放心里惦记\n\n难得有几个真兄弟\n走在不同的轨迹\n不必太多的言语\n当你需要\n我守护你')
const targetText = ref('')
const selectAllDetected = ref(false)
const copyDetected = ref(false)
const pasteDetected = ref(false)

const sourceTextarea = ref(null)
const targetTextarea = ref(null)

// 处理键盘事件
const handleKeydown = (event) => {
  // 检测 Ctrl+V
  if (event.ctrlKey && event.key === 'v') {
    // 粘贴操作会在 paste 事件中处理
    return
  }
}

// 处理粘贴事件
const handlePaste = (event) => {
  pasteDetected.value = true
  
  // 检查粘贴的内容是否与源文本匹配
  setTimeout(() => {
    if (targetText.value.trim() === sourceText.value.trim()) {
      setTimeout(() => {
        completed.value = true
        emit('challenge-completed')
      }, 100)
    }
  }, 100)
}

// 全局键盘事件监听
const handleGlobalKeydown = (event) => {
  // 检测 Ctrl+A
  if (event.ctrlKey && event.key === 'a') {
    if (document.activeElement === sourceTextarea.value) {
      event.preventDefault()
      sourceTextarea.value.select()
      selectAllDetected.value = true
    }
  }
  
  // 检测 Ctrl+C
  if (event.ctrlKey && event.key === 'c') {
    if (document.activeElement === sourceTextarea.value && selectAllDetected.value) {
      const selection = window.getSelection().toString()
      if (selection.length > 0 || sourceTextarea.value.selectionStart !== sourceTextarea.value.selectionEnd) {
        copyDetected.value = true
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
  
  // 自动聚焦到源文本框
  setTimeout(() => {
    if (sourceTextarea.value) {
      sourceTextarea.value.focus()
    }
  }, 500)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
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

.editor-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.editor-window {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 400px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.editor-content {
  height: calc(100% - 60px);
  padding: 0;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: white;
}

.editor-textarea:focus {
  background: #fefefe;
}

.editor-textarea[readonly] {
  background: #f8f9fa;
  color: #495057;
}

.arrow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.arrow {
  font-size: 2rem;
  color: #3b82f6;
  font-weight: bold;
}

.shortcut-hint {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.progress-step.completed {
  color: #10b981;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.progress-step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-text {
  font-size: 0.75rem;
  text-align: center;
  font-weight: 600;
}

.progress-arrow {
  color: #9ca3af;
  font-size: 1.25rem;
  font-weight: bold;
}

kbd {
  background-color: #f1f3f4;
  border: 1px solid #dadce0;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  color: #202124;
  display: inline-block;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  margin: 0 2px;
  padding: 2px 4px;
  text-align: center;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .arrow-container .arrow {
    transform: rotate(90deg);
  }
  
  .shortcut-hint {
    transform: rotate(0deg);
  }
  
  .progress-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .progress-arrow {
    transform: rotate(90deg);
  }
}
</style>