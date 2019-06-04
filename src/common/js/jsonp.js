import originJSONP from 'jsonp'

/**
 * 封装一个 jsonp 方法,解决请求跨域问题
 * @param {string} url 请求的地址
 * @param {Object} data  请求的参数
 * @param {Object} option jsonp 的配置项
 * @return Promise
 **/
export const jsonp = (url, data, option) => {
  // 拼接 url
  url += (url.includes('?') ? '&' : '?') + param(data)

  // 返回 Promise
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * 封装一个拼接 url 的方法
 * @param {Object} 要拼接的参数  一个对象
 * @param substring(start, stop) substring() 方法用于提取字符串中介于两个指定下标之间的字符  返回值 一个新的字符串
 * @param encodeURIComponent() encodeURIComponent() 函数可把字符串作为 URI 组件进行编码.  返回值  URIstring 的副本，其中的某些字符将被十六进制的转义序列进行替换
 **/
const param = (data) => {
  let url = ''
  // 循环遍历对象
  for (let key in data) {
    // 判断是否为空, 取出值
    let value = data[key] !== undefined ? data[key] : ''
    // 拼接参数
    url += `&${key}=${encodeURIComponent(value)}`
  }
  // 返回去掉 首个字符
  return url ? url.substring(1) : ''
}
