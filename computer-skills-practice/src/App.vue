<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import IntroSection from './components/IntroSection.vue'
</script>

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

<style>

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  width: 100%;
  overflow-x: hidden;
}

html {
  width: 100%;
}
</style>
