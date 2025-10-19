<template>
  <div class="challenge-container">
    <!-- 挑战状态 -->
    <div v-if="!completed" class="mb-8">
      <div class="text-lg text-gray-700 mb-6">
        点击下面的按钮来完成这个挑战
      </div>
      
      <!-- 点击按钮 -->
      <BaseButton 
        variant="orange"
        @click="handleClick"
      >
        点击我！
      </BaseButton>
      
      <!-- 提示文字 -->
      <div class="mt-6 text-sm text-gray-500">
        <IconLightbulb class="text-yellow-500 inline-block mr-1" />
        提示：用鼠标左键点击按钮
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else class="completion-animation">
      <IconTaskAlt class="text-6xl text-green-600 mb-4 animate-bounce" />
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600">很好！你已经学会了如何点击按钮</p>
    </div>
  </div>
</template>

<script setup>
import { IconLightbulb, IconTaskAlt } from '@iconify-prerendered/vue-material-symbols'
import { ref } from 'vue'

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const isAnimating = ref(false)

const handleClick = () => {
  if (completed.value) return
  
  // 添加点击动画效果
  isAnimating.value = true
  
  setTimeout(() => {
    isAnimating.value = false
    completed.value = true
    
    // 立即通知父组件挑战完成
    emit('challenge-completed')
  }, 200)
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