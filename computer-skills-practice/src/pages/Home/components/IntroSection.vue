<template>
  <section class="py-20 px-4 bg白 w-full mb-8">
    <div class="mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          为什么选择我们的平台？
        </h2>
        <p class="text-lg text-gray-600 mx-auto">
          我们致力于为每个学习者提供最优质的计算机技能学习体验，帮助你在数字时代脱颖而出。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 特色1 -->
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">专业课程体系</h3>
          <p class="text-gray-600">
            从基础操作到高级编程，循序渐进的学习路径，确保每个知识点都能扎实掌握。
          </p>
        </div>

        <!-- 特色2 -->
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">实践导向学习</h3>
          <p class="text-gray-600">
            通过真实项目和互动练习，让你在实践中学习，在学习中成长，快速提升实际操作能力。
          </p>
        </div>

        <!-- 特色3 -->
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text紫-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">智能进度跟踪</h3>
          <p class="text-gray-600">
            实时记录学习进度，智能推荐学习内容，个性化的学习体验让你的成长更加高效。
          </p>
        </div>
      </div>

      <div class="text-center mt-12">
        <BaseButton variant="primary" @click="startLearning">立即开始学习</BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startLearning = () => {
  router.push('/uc')
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>