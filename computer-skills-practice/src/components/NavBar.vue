<template>
  <nav class="bg-white shadow-sm border-b w-full mb-6">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- 品牌标识 -->
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-800">
            TM计算机技能练习网
          </h1>
        </div>

        <!-- 导航菜单和按钮 -->
        <div class="flex space-x-6">
          <a href="#" class="text-gray-600 hover:text-gray-900">首页</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">练习</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">关于</a>
          
          <!-- 登录注册按钮 -->
          <div class="flex space-x-3 ml-6">
            <button class="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded">
              登录
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
              注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// 简化后的导航栏，移除移动端复杂逻辑
</script>