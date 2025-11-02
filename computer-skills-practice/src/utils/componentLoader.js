// 组件自动加载器
// 为了方便添加新的练习组件，提供自动化的组件导入和映射功能

// 静态导入所有挑战组件
import ClickChallenge from '@/pages/Course/components/challenges/01-click-course/ClickChallenge.vue'
import DoubleClickChallenge from '@/pages/Course/components/challenges/01-click-course/DoubleClickChallenge.vue'
import FileDragChallenge from '@/pages/Course/components/challenges/02-drag-course/FileDragChallenge.vue'
import ListDragChallenge from '@/pages/Course/components/challenges/02-drag-course/ListDragChallenge.vue'
import ContextMenuCopyPasteChallenge from '@/pages/Course/components/challenges/03-context-menu-course/ContextMenuCopyPasteChallenge.vue'
import ContextMenuNewFileChallenge from '@/pages/Course/components/challenges/03-context-menu-course/ContextMenuNewFileChallenge.vue'
import ContextMenuOpenChallenge from '@/pages/Course/components/challenges/03-context-menu-course/ContextMenuOpenChallenge.vue'
import ShortcutCopyPasteChallenge from '@/pages/Course/components/challenges/04-shortcut-course/ShortcutCopyPasteChallenge.vue'
import ShortcutSelectAllChallenge from '@/pages/Course/components/challenges/04-shortcut-course/ShortcutSelectAllChallenge.vue'
import AddressBarChallenge from '@/pages/Course/components/challenges/05-url-basics-course/AddressBarChallenge.vue'
import DomainIdentificationChallenge from '@/pages/Course/components/challenges/05-url-basics-course/DomainIdentificationChallenge.vue'
import SuffixIdentificationChallenge from '@/pages/Course/components/challenges/05-url-basics-course/SuffixIdentificationChallenge.vue'
import ValidUrlChallenge from '@/pages/Course/components/challenges/05-url-basics-course/ValidUrlChallenge.vue'

// 组件映射表 - 使用完整路径作为键
export const componentMap = {
  'challenges/01-click-course/ClickChallenge.vue': ClickChallenge,
  'challenges/01-click-course/DoubleClickChallenge.vue': DoubleClickChallenge,
  'challenges/02-drag-course/FileDragChallenge.vue': FileDragChallenge,
  'challenges/02-drag-course/ListDragChallenge.vue': ListDragChallenge,
  'challenges/03-context-menu-course/ContextMenuCopyPasteChallenge.vue': ContextMenuCopyPasteChallenge,
  'challenges/03-context-menu-course/ContextMenuNewFileChallenge.vue': ContextMenuNewFileChallenge,
  'challenges/03-context-menu-course/ContextMenuOpenChallenge.vue': ContextMenuOpenChallenge,
  'challenges/04-shortcut-course/ShortcutCopyPasteChallenge.vue': ShortcutCopyPasteChallenge,
  'challenges/04-shortcut-course/ShortcutSelectAllChallenge.vue': ShortcutSelectAllChallenge,
  'challenges/05-url-basics-course/AddressBarChallenge.vue': AddressBarChallenge,
  'challenges/05-url-basics-course/DomainIdentificationChallenge.vue': DomainIdentificationChallenge,
  'challenges/05-url-basics-course/SuffixIdentificationChallenge.vue': SuffixIdentificationChallenge,
  'challenges/05-url-basics-course/ValidUrlChallenge.vue': ValidUrlChallenge
}

/**
 * 根据组件路径获取组件
 * @param {string} componentPath - 组件路径
 * @returns {Object|null} - Vue组件或null
 */
export function getComponent(componentPath) {
  const component = componentMap[componentPath]
  
  if (!component) {
    console.error(`组件未找到: ${componentPath}`)
    console.log('可用组件:', Object.keys(componentMap))
    return null
  }
  
  return component
}

/**
 * 获取所有可用组件的路径列表
 * @returns {string[]} - 组件路径数组
 */
export function getAvailableComponents() {
  return Object.keys(componentMap)
}

/**
 * 检查组件是否存在
 * @param {string} componentPath - 组件路径
 * @returns {boolean} - 是否存在
 */
export function hasComponent(componentPath) {
  return componentPath in componentMap
}