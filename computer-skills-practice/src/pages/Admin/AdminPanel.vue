<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">管理员中心</h1>
          <p class="mt-2 text-gray-600">管理用户和系统设置</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.totalUsers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">活跃用户</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.activeUsers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">管理员</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.adminUsers }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户管理 -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">用户管理</h2>
              <BaseButton 
                variant="primary"
                @click="showCreateUserModal = true"
              >
                添加用户
              </BaseButton>
            </div>

            <!-- 用户列表 -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      经验值
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      注册时间
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">
                              {{ user.username.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'" 
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ user.isActive ? '活跃' : '禁用' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ user.experience || 0 }} XP
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <BaseButton 
                        variant="secondary"
                        @click="editUser(user)"
                      >
                        编辑
                      </BaseButton>
                      <BaseButton 
                        variant="red"
                        @click="deleteUser(user)"
                        :disabled="user.id === currentUser?.id"
                        class="ml-3"
                      >
                        删除
                      </BaseButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 创建用户模态框 -->
    <div v-if="showCreateUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">添加新用户</h3>
          <form @submit.prevent="createUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">用户名</label>
                <input 
                  v-model="newUser.username" 
                  type="text" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">邮箱</label>
                <input 
                  v-model="newUser.email" 
                  type="email" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">密码</label>
                <input 
                  v-model="newUser.password" 
                  type="password" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">角色</label>
                <select 
                  v-model="newUser.role"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <BaseButton 
                variant="secondary"
                type="button"
                @click="showCreateUserModal = false"
              >
                取消
              </BaseButton>
              <BaseButton 
                variant="primary"
                type="submit"
              >
                创建
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- 编辑用户模态框 -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">编辑用户</h3>
          <form @submit.prevent="updateUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">用户名</label>
                <input 
                  v-model="editingUser.username" 
                  type="text" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">邮箱</label>
                <input 
                  v-model="editingUser.email" 
                  type="email" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">角色</label>
                <select 
                  v-model="editingUser.role"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">状态</label>
                <select 
                  v-model="editingUser.isActive"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option :value="true">活跃</option>
                  <option :value="false">禁用</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">经验值</label>
                <input 
                  v-model.number="editingUser.experience" 
                  type="number" 
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <BaseButton 
                variant="secondary"
                type="button"
                @click="showEditUserModal = false"
              >
                取消
              </BaseButton>
              <BaseButton 
                variant="primary"
                type="submit"
              >
                保存
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import BaseButton from '../../components/BaseButton.vue'

const router = useRouter()
const users = ref([])
const currentUser = ref(null)
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  adminUsers: 0
})

const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)
const editingUser = ref(null)
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

onMounted(async () => {
  await checkAdminAccess()
  await fetchUsers()
})

const checkAdminAccess = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      currentUser.value = data.data.user
      
      if (data.data.user.role !== 'admin') {
        alert('您没有访问管理员中心的权限')
        router.push('/')
        return
      }
    } else {
      router.push('/auth')
    }
  } catch (error) {
    console.error('验证管理员权限失败:', error)
    router.push('/auth')
  }
}

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      users.value = data.data.users
      
      // 计算统计数据
      stats.value.totalUsers = users.value.length
      stats.value.activeUsers = users.value.filter(u => u.isActive).length
      stats.value.adminUsers = users.value.filter(u => u.role === 'admin').length
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const createUser = async () => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newUser.value)
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      showCreateUserModal.value = false
      newUser.value = { username: '', email: '', password: '', role: 'user' }
      await fetchUsers()
      alert('用户创建成功')
    } else {
      alert(data.message || '创建用户失败')
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    alert('创建用户失败')
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditUserModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`确定要删除用户 "${user.username}" 吗？`)) {
    return
  }
  
  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      await fetchUsers()
      alert('用户删除成功')
    } else {
      alert(data.message || '删除用户失败')
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    alert('删除用户失败')
  }
}

const updateUser = async () => {
  try {
    const response = await fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: editingUser.value.username,
        email: editingUser.value.email,
        role: editingUser.value.role,
        isActive: editingUser.value.isActive,
        experience: editingUser.value.experience || 0
      })
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      showEditUserModal.value = false
      editingUser.value = null
      await fetchUsers()
      alert('用户更新成功')
    } else {
      alert(data.message || '更新用户失败')
    }
  } catch (error) {
    console.error('更新用户失败:', error)
    alert('更新用户失败')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>