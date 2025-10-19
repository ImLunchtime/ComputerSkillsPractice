<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    @click="(e) => emit('click', e)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | gold | green | orange | red
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  // 用于在样例页面静态呈现悬停/按下状态：'' | 'hover' | 'active'
  state: { type: String, default: '' }
})

const emit = defineEmits(['click'])

const classes = computed(() => {
  const variantClass = props.variant ? `btn-${props.variant}` : 'btn-primary'
  const stateClass = props.state === 'hover' ? 'is-hover' : props.state === 'active' ? 'is-active' : ''
  return ['btn', variantClass, stateClass].filter(Boolean).join(' ')
})
</script>

<style scoped>
/* 基础样式：无边框、无圆角 */
.btn {
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .2s ease, transform .05s ease;
  -webkit-appearance: none;
  appearance: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* 主要按钮：蓝色背景 + 深蓝色下移3px无模糊阴影 */
.btn-primary {
  background-color: #2563eb; /* blue-600 */
  color: #ffffff;
  box-shadow: 0 3px 0 #1e40af; /* blue-800 */
}
.btn-primary:hover,
.btn-primary.is-hover { background-color: #1d4ed8; /* blue-700 */ }
.btn-primary:active,
.btn-primary.is-active { transform: translateY(3px); box-shadow: 0 0 0 #1e40af; }

/* 次要按钮：白色背景 + 灰色下移3px无模糊阴影 */
.btn-secondary {
  background-color: #ffffff;
  color: #1f2937; /* gray-800 */
  box-shadow: 0 3px 0 #9ca3af; /* gray-400 */
}
.btn-secondary:hover,
.btn-secondary.is-hover { background-color: #f9fafb; /* gray-50 */ }
.btn-secondary:active,
.btn-secondary.is-active { transform: translateY(3px); box-shadow: 0 0 0 #9ca3af; }

/* 金色（黄色）按钮 */
.btn-gold {
  background-color: #f59e0b; /* amber-500 */
  color: #ffffff;
  box-shadow: 0 3px 0 #b45309; /* amber-700 */
}
.btn-gold:hover,
.btn-gold.is-hover { background-color: #d97706; /* amber-600 */ }
.btn-gold:active,
.btn-gold.is-active { transform: translateY(3px); box-shadow: 0 0 0 #b45309; }

/* 绿色按钮（浅绿色） */
.btn-green {
  background-color: #86efac; /* green-300 */
  color: #064e3b; /* green-800 提升可读性 */
  box-shadow: 0 3px 0 #22c55e; /* green-500 */
}
.btn-green:hover,
.btn-green.is-hover { background-color: #6ee7b7; /* green-300 接近 */ }
.btn-green:active,
.btn-green.is-active { transform: translateY(3px); box-shadow: 0 0 0 #22c55e; }

/* 橙色按钮 */
.btn-orange {
  background-color: #f97316; /* orange-500 */
  color: #ffffff;
  box-shadow: 0 3px 0 #c2410c; /* orange-700 */
}
.btn-orange:hover,
.btn-orange.is-hover { background-color: #ea580c; /* orange-600 */ }
.btn-orange:active,
.btn-orange.is-active { transform: translateY(3px); box-shadow: 0 0 0 #c2410c; }

/* 红色按钮 */
.btn-red {
  background-color: #ef4444; /* red-500 */
  color: #ffffff;
  box-shadow: 0 3px 0 #b91c1c; /* red-700 */
}
.btn-red:hover,
.btn-red.is-hover { background-color: #dc2626; /* red-600 */ }
.btn-red:active,
.btn-red.is-active { transform: translateY(3px); box-shadow: 0 0 0 #b91c1c; }
</style>