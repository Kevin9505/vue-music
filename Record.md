# 1. 移动端项目开发定义规范(颜色,字体大小,整体页面规范)
`在开展项目开发之前,先定义好这些规范,保证开发过程中保持一致; 注: 重置样式用在最先.`
```stylus
/* 颜色定义规范 */
$color-background = #222
$color-background-d = rgba(0, 0, 0, 0.3)
$color-highlight-background = #333
$color-dialog-background = #666
$color-theme = #ffcd32
$color-theme-d = rgba(255, 205, 49, 0.5)
$color-sub-theme = #d93f30
$color-text = #fff
$color-text-d = rgba(255, 255, 255, 0.3)
$color-text-l = rgba(255, 255, 255, 0.5)
$color-text-ll = rgba(255, 255, 255, 0.8)


/* 字体定义规范 */
$font-size-small-s = 10px
$font-size-small = 12px
$font-size-medium = 14px
$font-size-medium-x = 16px
$font-size-large = 18px
$font-size-large-x = 22px


/* 整体规范 */
body, html
  line-height: 1
  font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback'
  user-select: none
  -webkit-tap-highlight-color: transparent
  background: $color-background
  color: $color-text

/* 样式重置 */
/**
 * Eric Meyer's Reset CSS v2.0 (http://meyerweb.com/eric/tools/css/reset/)
 * http://cssreset.com
 */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header,
menu, nav, output, ruby, section, summary,
time, mark, audio, video, input
  margin: 0
  padding: 0
  border: 0
  font-size: 100%
  font-weight: normal
  vertical-align: baseline

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, menu, nav, section
  display: block

body
  line-height: 1

blockquote, q
  quotes: none

blockquote:before, blockquote:after,
q:before, q:after
  content: none

table
  border-collapse: collapse
  border-spacing: 0

/* custom */

a
  color: #7e8c8d
  -webkit-backface-visibility: hidden
  text-decoration: none

li
  list-style: none

body
  -webkit-text-size-adjust: none
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)

/* 在移动端开发中,一定遇到不同分辨率的问题,图片可准备 @2 图 和 @3 图,以适应不同手机分辨率 */

// 背景图片
bg-image($url)
  background-image: url($url + "@2x.png")
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    background-image: url($url + "@3x.png")

// 不换行
no-wrap()
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap

// 扩展点击区域
extend-click()
  position: relative
  &:before
    content: ''
    position: absolute
    top: -10px
    left: -10px
    right: -10px
    bottom: -10px

```

# 2. 使用 jsonp 解决跨域问题
[jsonp github地址](https://github.com/webmodules/jsonp)
`npm install jsonp`  或者 `yarn jsonp`

## 2.1 利用 Promise 封装 jsonp 请求
```js
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

```

# 3. js 常用方法
|方法名|描述|用法|
|---|---|---|
|join|用于把数组中的所有元素放入一个字符串|11|


