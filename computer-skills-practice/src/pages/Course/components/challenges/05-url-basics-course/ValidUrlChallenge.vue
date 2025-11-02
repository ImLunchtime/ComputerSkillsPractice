<template>
  <div class="challenge-container">
    <!-- 挑战状态 -->
    <div v-if="!completed" class="mb-8">
      <div class="text-lg text-gray-700 mb-6">
        请从下面四个选项中找出合法的URL，然后点击它
      </div>
      
      <!-- URL选项区域 -->
      <div class="url-options grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
        <div 
          v-for="(option, index) in currentOptions" 
          :key="index"
          class="url-option bg-white border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
          @click="handleOptionClick(index)"
          :class="{ 
            'border-green-400 bg-green-50': selectedOption === index && option.isValid,
            'border-red-400 bg-red-50': selectedOption === index && !option.isValid,
            'ring-2 ring-blue-400': selectedOption === index
          }"
        >
          <div class="text-center">
            <div class="text-sm text-gray-500 mb-2">选项 {{ index + 1 }}:</div>
            <div class="text-lg font-mono break-all">{{ option.url }}</div>
          </div>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="showError" class="error-message bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-4">
        <div class="flex items-center">
          <IconError class="text-red-500 mr-2" />
          <div>
            <p class="text-red-800 font-medium">答案不正确</p>
            <p class="text-red-600 text-sm">这不是一个合法的URL，请再试一次</p>
          </div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div class="mt-6 text-sm text-gray-500">
        <IconLightbulb class="text-yellow-500 inline-block mr-1" />
        提示：合法的URL应该包含协议（如http://或https://）、域名和正确的格式
      </div>
    </div>
    
    <!-- URL格式说明（答错时显示） -->
    <div v-if="showExplanation && !completed" class="explanation bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-6">
      <h3 class="text-lg font-bold text-blue-800 mb-4">URL格式说明</h3>
      
      <div class="mb-4">
        <h4 class="font-semibold text-blue-700 mb-2">合法URL的特征：</h4>
        <ul class="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>必须包含协议（http:// 或 https://）</li>
          <li>必须有有效的域名</li>
          <li>域名格式正确（如：example.com）</li>
          <li>不能有空格或特殊字符在错误位置</li>
        </ul>
      </div>
      
      <div class="mb-4">
        <h4 class="font-semibold text-green-700 mb-2">正确答案：</h4>
        <div class="bg-green-100 border border-green-300 rounded p-3">
          <div class="font-mono text-green-800">{{ correctUrl }}</div>
          <div class="text-sm text-green-700 mt-1">这是一个完整、格式正确的URL</div>
        </div>
      </div>
      
      <div class="mb-4">
        <h4 class="font-semibold text-red-700 mb-2">错误示例分析：</h4>
        <div class="space-y-2">
          <div v-for="(option, index) in currentOptions" :key="index">
            <div v-if="!option.isValid" class="bg-red-100 border border-red-300 rounded p-3">
              <div class="font-mono text-red-800">{{ option.url }}</div>
              <div class="text-sm text-red-700 mt-1">{{ option.reason }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center">
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
      <p class="text-gray-600 mb-4">很好！你已经学会了识别合法的URL</p>
      
      <!-- 显示正确答案和知识点 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
        <h4 class="text-lg font-bold text-green-800 mb-4">正确答案</h4>
        <div class="bg-white border border-green-300 rounded p-4 mb-4">
          <div class="font-mono text-lg text-green-800">{{ correctUrl }}</div>
        </div>
        
        <div class="text-sm text-green-800">
          <h5 class="font-semibold mb-2">URL基础知识总结：</h5>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>协议：</strong>指定如何访问资源（http://、https://）</li>
            <li><strong>域名：</strong>网站的地址标识（如：www.example.com）</li>
            <li><strong>路径：</strong>指向网站内具体页面或资源的路径</li>
            <li><strong>参数：</strong>传递给网页的额外信息（如：?search=keyword）</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconLightbulb, IconTaskAlt, IconError } from '@iconify-prerendered/vue-material-symbols'
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['challenge-completed'])

const completed = ref(false)
const selectedOption = ref(null)
const showError = ref(false)
const showExplanation = ref(false)
const attemptCount = ref(0)
const currentSetIndex = ref(0)

// URL选项集合
const urlSets = [
  [
    { url: 'https://www.google.com', isValid: true, reason: '' },
    { url: 'www.facebook.com', isValid: false, reason: '缺少协议（http://或https://）' },
    { url: 'http://invalid..com', isValid: false, reason: '域名格式错误（连续的点）' },
    { url: 'https://example .com', isValid: false, reason: '域名中包含空格' }
  ],
  [
    { url: 'https://www.github.com', isValid: true, reason: '' },
    { url: 'https://.com', isValid: false, reason: '缺少域名主体部分' },
    { url: 'dsad://shdklhrf', isValid: false, reason: '协议格式错误，应该是http://或https://' },
    { url: 'www.site', isValid: false, reason: '缺少协议和顶级域名' }
  ],
  [
    { url: 'https://stackoverflow.com/questions', isValid: true, reason: '' },
    { url: 'https://askhdfh', isValid: false, reason: '域名格式错误，缺少有效的顶级域名' },
    { url: 'htp://example.com', isValid: false, reason: '协议拼写错误，应该是http://' },
    { url: 'fghj://qwerty.xyz', isValid: false, reason: '协议格式错误，应该是http://或https://' }
  ]
]

const currentOptions = computed(() => {
  return urlSets[currentSetIndex.value] || []
})

const correctUrl = computed(() => {
  return currentOptions.value.find(option => option.isValid)?.url || ''
})

const handleOptionClick = (index) => {
  if (completed.value) return
  
  selectedOption.value = index
  const option = currentOptions.value[index]
  attemptCount.value++
  
  if (option.isValid) {
    // 正确答案
    setTimeout(() => {
      completed.value = true
      emit('challenge-completed')
    }, 500)
  } else {
    // 错误答案
    showError.value = true
    setTimeout(() => {
      showError.value = false
      showExplanation.value = true
    }, 1500)
  }
}

const resetChallenge = () => {
  showError.value = false
  showExplanation.value = false
  selectedOption.value = null
  // 随机选择新的题目集合
  currentSetIndex.value = Math.floor(Math.random() * urlSets.length)
}

onMounted(() => {
  // 随机选择初始题目集合
  currentSetIndex.value = Math.floor(Math.random() * urlSets.length)
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

.url-option {
  transition: all 0.2s ease;
}

.url-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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