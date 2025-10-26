<template>
  <div class="p-8">
    <!-- 所有练习部分 -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6 mt-8">所有练习</h2>
      <div class="grid grid-cols-3 gap-6">
        <div 
           v-for="course in courses" 
           :key="course.id"
           class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
         >
           <!-- 课程图标 -->
           <div class="text-left mb-4">
             <div class="text-4xl mb-2">{{ course.icon }}</div>
           </div>
           
           <!-- 课程标题 -->
           <h3 class="text-lg font-semibold text-gray-900 mb-3 text-left">
             {{ course.title }}
           </h3>
           
           <!-- 课程简介 -->
           <p class="text-gray-600 text-sm mb-4 text-left line-clamp-2">
             {{ course.description }}
           </p>
           
           <!-- 已完成标签 -->
           <div 
             v-if="getCourseProgress(course.id) === 100"
             class="absolute bottom-6 left-6"
           >
             <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
               已完成
             </span>
           </div>
           
           <!-- 开始按钮 -->
           <div class="text-right">
             <BaseButton 
               variant="green" 
               @click="startCourse(course)"
             >
               {{ getCourseProgress(course.id) === 100 ? '重新练习' : '开始练习' }}
             </BaseButton>
           </div>
         </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="courses.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">📚</div>
        <p class="text-gray-500 text-lg">暂无练习内容</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '../../../components/BaseButton.vue'

const router = useRouter()

// 定义 props
const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  },
  userProgress: {
    type: Object,
    default: () => ({})
  }
})

// 获取课程进度
const getCourseProgress = (courseId) => {
  const course = props.courses.find(c => c.id === courseId)
  if (!course) return 0
  
  const progress = props.userProgress[courseId] || {}
  const completedChallenges = Object.values(progress).filter(completed => completed).length
  return Math.round((completedChallenges / course.challenges.length) * 100)
}

// 开始课程
const startCourse = (course) => {
  router.push(`/practice/${course.id}`)
}
</script>

<style scoped>
/* 限制文本行数 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>