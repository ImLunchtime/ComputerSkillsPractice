<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />

    <!-- 页面正文 -->
    <main class="max-w-5xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">设计语言</h1>
        <p class="text-gray-600">此页面用于展示和对齐网站的各种控件的样式与状态。</p>
      </div>

      <!-- 按钮样式演示，使用全局 BaseButton 组件 -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">按钮样式演示</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div class="text-sm text-gray-500 mb-2">主要按钮（Primary）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="primary">正常</BaseButton>
              <BaseButton variant="primary" state="hover">悬停</BaseButton>
              <BaseButton variant="primary" state="active">按下</BaseButton>
              <BaseButton variant="primary" :disabled="true">禁用</BaseButton>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-2">次要按钮（Secondary）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="secondary">正常</BaseButton>
              <BaseButton variant="secondary" state="hover">悬停</BaseButton>
              <BaseButton variant="secondary" state="active">按下</BaseButton>
              <BaseButton variant="secondary" :disabled="true">禁用</BaseButton>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-2">金色按钮（Gold / Yellow）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="gold">正常</BaseButton>
              <BaseButton variant="gold" state="hover">悬停</BaseButton>
              <BaseButton variant="gold" state="active">按下</BaseButton>
              <BaseButton variant="gold" :disabled="true">禁用</BaseButton>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-2">绿色按钮（Light Green）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="green">正常</BaseButton>
              <BaseButton variant="green" state="hover">悬停</BaseButton>
              <BaseButton variant="green" state="active">按下</BaseButton>
              <BaseButton variant="green" :disabled="true">禁用</BaseButton>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-2">橙色按钮（Orange）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="orange">正常</BaseButton>
              <BaseButton variant="orange" state="hover">悬停</BaseButton>
              <BaseButton variant="orange" state="active">按下</BaseButton>
              <BaseButton variant="orange" :disabled="true">禁用</BaseButton>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-2">红色按钮（Red）</div>
            <div class="flex items-center gap-4 flex-wrap">
              <BaseButton variant="red">正常</BaseButton>
              <BaseButton variant="red" state="hover">悬停</BaseButton>
              <BaseButton variant="red" state="active">按下</BaseButton>
              <BaseButton variant="red" :disabled="true">禁用</BaseButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<style scoped>
/* 页面特定样式（当前按钮样式已由 BaseButton 组件提供，此处留空以备后续扩展） */
</style>