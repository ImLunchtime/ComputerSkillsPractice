<script setup>
// 主应用组件
</script>

<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- 路由视图 -->
    <router-view />
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
