<template>
  <div class="challenge-container">
    <!-- 挑战状态 -->
    <div v-if="!completed" class="mb-8">
      <div class="text-lg text-gray-700 mb-6">
        快速双击下面的按钮来完成这个挑战
      </div>
      
      <!-- 双击按钮 -->
      <BaseButton 
        variant="orange"
        @dblclick="handleDoubleClick"
        @click="handleSingleClick"
      >
        {{ clickCount === 0 ? '双击我！' : '再点击一次！' }}
      </BaseButton>
      
      <!-- 点击计数显示 -->
      <div class="mt-4">
        <div class="text-sm text-gray-600">
          点击次数: {{ clickCount }} / 2
        </div>
        <div class="w-32 bg-gray-200 rounded-full h-2 mt-2 mx-auto">
          <div 
            class="bg-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: (clickCount / 2) * 100 + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="mt-6 text-sm text-gray-500">
        <IconLightbulb class="text-yellow-500 inline-block mr-1" /> 提示：需要快速点两次按钮（双击）才能通关！
      </div>
      
      <!-- 重置按钮 -->
      <button 
        v-if="clickCount > 0"
        @click="resetChallenge"
        class="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
      >
        重新开始
      </button>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <div class="text-6xl mb-4 animate-bounce">🎯</div>
      <h3 class="text-2xl font-bold text-purple-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">不错！你已经掌握了双击操作</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { IconLightbulb } from '@iconify-prerendered/vue-material-symbols'

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const isAnimating = ref(false)
const clickCount = ref(0)
const lastClickTime = ref(0)
const doubleClickDelay = 500 // 双击间隔时间（毫秒）

const handleSingleClick = () => {
  if (completed.value) return
  
  const currentTime = Date.now()
  
  // 如果距离上次点击时间太长，重置计数
  if (currentTime - lastClickTime.value > doubleClickDelay) {
    clickCount.value = 0
  }
  
  clickCount.value++
  lastClickTime.value = currentTime
  
  // 添加点击动画效果
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 200)
  
  // 如果超过2次点击但不是双击，重置
  if (clickCount.value > 2) {
    setTimeout(() => {
      resetChallenge()
    }, 400)
  }
}

const handleDoubleClick = () => {
  if (completed.value) return
  
  // 双击成功
  completed.value = true
  
  // 立即通知父组件挑战完成
  emit('challenge-completed')
}

const resetChallenge = () => {
  clickCount.value = 0
  lastClickTime.value = 0
}
</script>

<style scoped>
.challenge-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.completion-animation {
  text-align: center;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 0.5s ease-in-out;
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