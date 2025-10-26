<template>
  <div class="challenge-container">
    <div v-if="!completed" class="shortcut-challenge">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ challenge.title }}</h2>
      <p class="text-gray-600 mb-8">{{ challenge.description }}</p>
      
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
            <div class="text-sm text-gray-600 font-medium">源文档.txt</div>
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
          <div class="shortcut-hint">Ctrl+C → Ctrl+V</div>
        </div>
        
        <!-- 右侧编辑器 -->
        <div class="editor-window">
          <div class="editor-header">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-sm text-gray-600 font-medium">目标文档.txt</div>
            <div></div>
          </div>
          
          <div class="editor-content">
            <textarea
              ref="targetTextarea"
              v-model="targetText"
              class="editor-textarea"
              placeholder="请使用 Ctrl+C 和 Ctrl+V 将左侧文本复制到这里..."
              @contextmenu.prevent
              @keydown="handleKeydown"
              @paste="handlePaste"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-6 text-center">
        <div v-if="!copyDetected && !pasteDetected" class="text-gray-500">
          <p>💡 提示：</p>
          <p>1. 先选中左侧文本框中的内容</p>
          <p>2. 按 <kbd>Ctrl+C</kbd> 复制</p>
          <p>3. 点击右侧文本框，按 <kbd>Ctrl+V</kbd> 粘贴</p>
        </div>
        <div v-else-if="copyDetected && !pasteDetected" class="text-blue-600">
          <p>✅ 复制成功！现在请在右侧文本框中按 <kbd>Ctrl+V</kbd> 粘贴</p>
        </div>
        <div v-else-if="pasteDetected" class="text-green-600">
          <p>🎉 太棒了！你成功使用快捷键完成了复制粘贴操作！</p>
        </div>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎉</div>
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">你已经掌握了基本的复制粘贴快捷键操作</p>
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
const sourceText = ref('这是一段示例文本。一般来说，复制一段文本之前必须先选取它。我已经帮你选取了这段文本，你只需要按下快捷键复制即可。\n注意粘贴的时候得点一下右边的文本框哦！')
const targetText = ref('')
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
  // 检测 Ctrl+C
  if (event.ctrlKey && event.key === 'c') {
    // 检查当前焦点是否在源文本框
    if (document.activeElement === sourceTextarea.value) {
      const selection = window.getSelection().toString()
      if (selection.length > 0) {
        copyDetected.value = true
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
  
  // 自动选中源文本
  setTimeout(() => {
    if (sourceTextarea.value) {
      sourceTextarea.value.focus()
      sourceTextarea.value.select()
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
  height: 350px;
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
}
</style>