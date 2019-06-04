/**
 * 一个判断标签元素是否有类名的方法
 * @param {*} el 标签元素
 * @param {*} className 类名
 */
export const hasClass = (el, className) => {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 * 一个给标签元素添加类名的方法
 * @param {*} el 标签元素
 * @param {*} className 类名
 */
export const addClass = (el, className) => {
  if (hasClass(el, className)) return false

  let newClass = el.className.split(' ')
  newClass.push(className)
  // join() 方法用于把数组中的所有元素放入一个字符串。
  el.className = newClass.join(' ')
}
