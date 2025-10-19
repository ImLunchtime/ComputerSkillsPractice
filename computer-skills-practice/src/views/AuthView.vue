<template>
  <div>
    <LoginForm 
      v-if="currentView === 'login'"
      @switch-to-register="currentView = 'register'"
      @login-success="handleAuthSuccess"
    />
    <RegisterForm 
      v-else
      @switch-to-login="currentView = 'login'"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'

const router = useRouter()
const currentView = ref('login')

const handleAuthSuccess = (user) => {
  // 登录成功后跳转到主页或用户页面
  console.log('登录成功:', user)
  
  // 触发全局用户状态更新
  window.dispatchEvent(new CustomEvent('user-login', { detail: user }))
  
  // 跳转到主页
  router.push('/')
}

const handleRegisterSuccess = (user) => {
  // 注册成功后切换到登录页面
  console.log('注册成功:', user)
  currentView.value = 'login'
  
  // 可以显示一个成功消息
  alert('注册成功！请登录您的账户。')
}
</script>