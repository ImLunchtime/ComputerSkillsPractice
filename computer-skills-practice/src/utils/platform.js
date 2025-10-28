/**
 * 平台检测工具函数
 */

/**
 * 检测用户是否使用Mac系统
 * @returns {boolean} 如果是Mac系统返回true，否则返回false
 */
export function isMac() {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform) || 
         /Mac/.test(navigator.userAgent);
}

/**
 * 获取当前平台的修饰键名称
 * @returns {string} Mac系统返回'Cmd'，其他系统返回'Ctrl'
 */
export function getModifierKey() {
  return isMac() ? 'Cmd' : 'Ctrl';
}

/**
 * 获取当前平台的修饰键显示名称
 * @returns {string} Mac系统返回'Command'，其他系统返回'Ctrl'
 */
export function getModifierKeyDisplay() {
  return isMac() ? 'Command' : 'Ctrl';
}

/**
 * 检查键盘事件是否按下了修饰键
 * @param {KeyboardEvent} event - 键盘事件对象
 * @returns {boolean} 如果按下了修饰键返回true
 */
export function isModifierKeyPressed(event) {
  return isMac() ? event.metaKey : event.ctrlKey;
}