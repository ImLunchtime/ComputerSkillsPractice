<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          注册新账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <BaseButton variant="secondary" @click="$emit('switch-to-login')" class="text-sm">
            登录现有账户
          </BaseButton>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              v-model="form.username"
              @blur="checkUsername"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入用户名"
            />
            <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              v-model="form.email"
              @blur="checkEmail"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入邮箱地址"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="form.password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入密码（至少6位）"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">确认密码</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              v-model="form.confirmPassword"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请再次输入密码"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <BaseButton
            type="submit"
            :disabled="loading || !isFormValid"
            variant="primary"
            class="w-full"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['switch-to-login', 'register-success'])

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// 表单验证
const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         !usernameError.value &&
         !emailError.value &&
         !passwordError.value &&
         !confirmPasswordError.value
})

// 监听密码变化
watch(() => form.value.password, (newPassword) => {
  if (newPassword && newPassword.length < 6) {
    passwordError.value = '密码长度至少为6位'
  } else {
    passwordError.value = ''
  }
  
  // 重新验证确认密码
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
})

// 监听确认密码变化
watch(() => form.value.confirmPassword, validateConfirmPassword)

function validateConfirmPassword() {
  if (form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致'
  } else {
    confirmPasswordError.value = ''
  }
}

// 检查用户名是否可用
const checkUsername = async () => {
  if (!form.value.username) return
  
  try {
    const response = await fetch(`/api/auth/check-username/${encodeURIComponent(form.value.username)}`)
    const data = await response.json()
    
    if (!data.data.available) {
      usernameError.value = '用户名已被使用'
    } else {
      usernameError.value = ''
    }
  } catch (err) {
    console.error('检查用户名失败:', err)
  }
}

// 检查邮箱是否可用
const checkEmail = async () => {
  if (!form.value.email) return
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }
  
  try {
    const response = await fetch(`/api/auth/check-email/${encodeURIComponent(form.value.email)}`)
    const data = await response.json()
    
    if (!data.data.available) {
      emailError.value = '邮箱已被使用'
    } else {
      emailError.value = ''
    }
  } catch (err) {
    console.error('检查邮箱失败:', err)
  }
}

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = '请正确填写所有字段'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        confirmPassword: form.value.confirmPassword
      })
    })

    const data = await response.json()

    if (data.status === 'success') {
      emit('register-success', data.data.user)
    } else {
      error.value = data.message || '注册失败'
    }
  } catch (err) {
    console.error('注册错误:', err)
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>