<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <BaseButton variant="secondary" @click="$emit('switch-to-register')" class="text-sm">
            注册
          </BaseButton>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名或邮箱</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              v-model="form.username"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="用户名或邮箱"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="form.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <BaseButton
            type="submit"
            :disabled="loading"
            variant="primary"
            class="w-full"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['switch-to-register', 'login-success'])

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    error.value = '请填写所有字段'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password
      })
    })

    const data = await response.json()

    if (data.status === 'success') {
      emit('login-success', data.data.user)
    } else {
      error.value = data.message || '登录失败'
    }
  } catch (err) {
    console.error('登录错误:', err)
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>