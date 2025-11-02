<template>
  <div class="challenge-container">
    <!-- 挑战状态 -->
    <div v-if="!completed" class="mb-8">
      <div class="text-lg text-gray-700 mb-6">
        请从下面的URL中找出一级域名部分，然后点击它
      </div>
      
      <!-- URL显示区域 -->
      <div class="url-display bg-gray-100 border-2 border-gray-300 rounded-lg p-6 max-w-3xl mx-auto mb-6">
        <div class="text-center">
          <div class="text-sm text-gray-500 mb-2">示例URL：</div>
          <div class="text-2xl font-mono bg-white border border-gray-200 rounded px-4 py-3 inline-block">
            <span class="text-gray-600">https://</span>
            <span class="text-blue-600">www</span>
            <span class="text-gray-600">.</span>
            <span 
              class="domain-part cursor-pointer hover:bg-yellow-200 px-1 rounded transition-colors"
              @click="handleDomainClick"
              :class="{ 'bg-yellow-300': isClicked }"
            >{{ currentUrl.domain }}</span>
            <span class="text-gray-600">.</span>
            <span class="text-purple-600">{{ currentUrl.suffix }}</span>
            <span class="text-gray-600">{{ currentUrl.path }}</span>
          </div>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="showError" class="error-message bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-4">
        <div class="flex items-center">
          <IconError class="text-red-500 mr-2" />
          <div>
            <p class="text-red-800 font-medium">答案不正确</p>
            <p class="text-red-600 text-sm">请仔细观察URL的结构，再试一次</p>
          </div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="mt-6 text-sm text-gray-500">
        <IconLightbulb class="text-yellow-500 inline-block mr-1" />
        提示：一级域名是网站的主要名称部分，位于"www."之后和域名后缀之前
      </div>
    </div>
    
    <!-- URL结构说明（答错时显示） -->
    <div v-if="showStructure && !completed" class="structure-explanation bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto mb-6">
      <h3 class="text-lg font-bold text-blue-800 mb-4">URL结构说明</h3>
      <div class="text-center mb-4">
        <div class="text-xl font-mono bg-white border border-blue-200 rounded px-4 py-3 inline-block">
          <span class="bg-green-200 px-1 rounded">https://</span>
          <span class="bg-orange-200 px-1 rounded">www</span>
          <span>.</span>
          <span class="bg-yellow-200 px-1 rounded font-bold">{{ currentUrl.domain }}</span>
          <span>.</span>
          <span class="bg-purple-200 px-1 rounded">{{ currentUrl.suffix }}</span>
          <span class="bg-gray-200 px-1 rounded">{{ currentUrl.path }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="bg-green-200 px-2 py-1 rounded mb-1">协议</div>
          <div class="text-gray-600">https://</div>
        </div>
        <div class="text-center">
          <div class="bg-orange-200 px-2 py-1 rounded mb-1">子域名</div>
          <div class="text-gray-600">www</div>
        </div>
        <div class="text-center">
          <div class="bg-yellow-200 px-2 py-1 rounded mb-1 font-bold">一级域名</div>
          <div class="text-gray-600">{{ currentUrl.domain }}</div>
        </div>
        <div class="text-center">
          <div class="bg-purple-200 px-2 py-1 rounded mb-1">域名后缀</div>
          <div class="text-gray-600">{{ currentUrl.suffix }}</div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <button 
          @click="resetChallenge"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          再试一次
        </button>
      </div>
    </div>
    
    <!-- 完成状态 -->
    <div v-else-if="completed" class="completion-animation">
      <IconTaskAlt class="text-6xl text-green-600 mb-4 animate-bounce" />
      <h3 class="text-2xl font-bold text-green-600 mb-2">挑战完成！</h3>
      <p class="text-gray-600 mb-4">很好！你已经学会了识别URL中的一级域名</p>
      
      <!-- 显示正确的URL结构 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 max-w-3xl mx-auto">
        <h4 class="text-lg font-bold text-green-800 mb-4">正确答案 - URL结构</h4>
        <div class="text-center mb-4">
          <div class="text-xl font-mono bg-white border border-green-200 rounded px-4 py-3 inline-block">
            <span class="bg-green-200 px-1 rounded">https://</span>
            <span class="bg-orange-200 px-1 rounded">www</span>
            <span>.</span>
            <span class="bg-yellow-200 px-1 rounded font-bold">{{ currentUrl.domain }}</span>
            <span>.</span>
            <span class="bg-purple-200 px-1 rounded">{{ currentUrl.suffix }}</span>
            <span class="bg-gray-200 px-1 rounded">{{ currentUrl.path }}</span>
          </div>
        </div>
        <div class="text-sm text-green-800">
          <strong>一级域名：</strong>{{ currentUrl.domain }} - 这是网站的主要标识名称
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconLightbulb, IconTaskAlt, IconError } from '@iconify-prerendered/vue-material-symbols'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const isClicked = ref(false)
const showError = ref(false)
const showStructure = ref(false)
const attemptCount = ref(0)

// URL示例数据
const urlExamples = [
  { domain: 'google', suffix: 'com', path: '/search?q=example' },
  { domain: 'github', suffix: 'com', path: '/user/repository' },
  { domain: 'stackoverflow', suffix: 'com', path: '/questions/12345' },
  { domain: 'wikipedia', suffix: 'org', path: '/wiki/Computer' },
  { domain: 'mozilla', suffix: 'org', path: '/en-US/docs' }
]

const currentUrl = ref({})

// 随机选择一个URL示例
const selectRandomUrl = () => {
  const randomIndex = Math.floor(Math.random() * urlExamples.length)
  currentUrl.value = urlExamples[randomIndex]
}

const handleDomainClick = () => {
  if (completed.value) return
  
  isClicked.value = true
  attemptCount.value++
  
  setTimeout(() => {
    completed.value = true
    emit('challenge-completed')
  }, 500)
}

const resetChallenge = () => {
  showError.value = false
  showStructure.value = false
  isClicked.value = false
  selectRandomUrl() // 选择新的URL示例
}

onMounted(() => {
  selectRandomUrl()
})
</script>

<style scoped>
.challenge-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.domain-part {
  transition: all 0.2s ease;
}

.completion-animation {
  text-align: center;
}

.error-message {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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