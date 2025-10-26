<template>
  <aside class="w-1/5 bg-white shadow-lg border-2 border-gray-300 rounded-2xl p-6 mr-4 mt-4">
    <nav class="space-y-2">
      <!-- 专项练习 -->
      <div 
        class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
        :class="selectedTab === 'practice' ? 'bg-gray-100' : 'hover:bg-gray-50'"
        @click="selectTab('practice')"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 mr-3">
          <span class="text-white text-sm">📚</span>
        </div>
        <span class="text-gray-700 font-medium">专项练习</span>
      </div>
      
      <!-- 技能学习 -->
      <div 
        class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
        :class="selectedTab === 'learning' ? 'bg-gray-100' : 'hover:bg-gray-50'"
        @click="selectTab('learning')"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 mr-3">
          <span class="text-white text-sm">🎓</span>
        </div>
        <span class="text-gray-700 font-medium">技能学习（即将上线）</span>
      </div>
      
      <!-- 个人资料 -->
      <div 
        class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
        :class="selectedTab === 'profile' ? 'bg-gray-100' : 'hover:bg-gray-50'"
        @click="selectTab('profile')"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 mr-3">
          <span class="text-white text-sm">👤</span>
        </div>
        <span class="text-gray-700 font-medium">个人资料</span>
      </div>
    </nav>
  </aside>
</template>

<script setup>
// 定义 props
const props = defineProps({
  selectedTab: {
    type: String,
    default: 'practice'
  }
})

// 定义 emits
const emit = defineEmits(['tab-change'])

// 选择选项卡
const selectTab = (tab) => {
  emit('tab-change', tab)
}
</script>