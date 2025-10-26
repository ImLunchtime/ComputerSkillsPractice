<template>
  <section class="bg-gray-50 py-20 px-4 w-full mb-8">
    <div class="mx-auto text-center">
      <!-- 主标题 -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        提升你的<span class="text-blue-600">计算机技能</span>
      </h1>
      
      <!-- 副标题 -->
      <p class="text-lg text-gray-600 mb-8 mx-auto">
        通过互动练习和实践项目，掌握现代计算机技能，从基础操作到高级编程
      </p>
      
      <!-- 行动按钮 -->
      <div class="flex justify-center gap-4 mb-12">
        <BaseButton variant="primary" @click="startLearning">开始学习</BaseButton>
        <BaseButton variant="secondary">了解更多</BaseButton>
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