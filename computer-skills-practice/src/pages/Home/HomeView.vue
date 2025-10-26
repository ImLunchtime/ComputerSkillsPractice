<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容 -->
    <main class="w-full py-4">
      <!-- Hero区域 -->
      <HeroSection />
      
      <!-- 介绍部分 -->
      <IntroSection />
    </main>
  </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import IntroSection from './components/IntroSection.vue'
</script>

<style scoped>
/* 组件特定样式 */
</style>