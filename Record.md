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
|方法名|描述|用法|参数|返回值|
|---|---|---|---|---|
|join()|用于把数组中的所有元素放入一个字符串|array.json(separator) |separator  可选。指定要使用的分隔符。如果省略该参数，则使用逗号作为分隔符。|返回一个字符串，该字符串是通过把 arrayObject 的每个元素转换为字符串，然后把这些字符串连接起来，在两个元素之间插入 separator 字符串而生成的。|
|push()|可向数组的末尾添加一个或多个元素，并返回新的长度|arrayObject.push(newelement1,newelement2,....,newelementX)|newelement1，必需。要添加到数组的第一个元素；<br>newelement2，可选。要添加到数组的第二个元素；<br>newelementX，可选。可添加多个元素。<br>|把指定的值添加到数组后的新长度。|
|split()|用于把一个字符串分割成字符串数组。|stringObject.split(separator,howmany)|separator，必需。字符串或正则表达式，从该参数指定的地方分割 stringObject。<br>howmany，可选。该参数可指定返回的数组的最大长度。如果设置了该参数，返回的子串不会多于这个参数指定的数组。如果没有设置该参数，整个字符串都会被分割，不考虑它的长度。|一个字符串数组，该数组是通过在 separator 指定的边界处将字符串 stringObject 分割成子串创建的。返回的数组中的字串不包括 separator 自身。|
|includes()|用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。|arr.includes(searchElement, fromIndex)|searchElement，必须。需要查找的元素值。<br>fromIndex，可选。从该索引处开始查找 searchElement。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。默认为 0。|布尔值。如果找到指定值返回 true，否则返回 false。|
|substring()|用于提取字符串中介于两个指定下标之间的字符。|stringObject.substring(start,stop)|start，必需。一个非负的整数，规定要提取的子串的第一个字符在 stringObject 中的位置。<br>stop，可选。一个非负的整数，比要提取的子串的最后一个字符在 stringObject 中的位置多 1。如果省略该参数，那么返回的子串会一直到字符串的结尾。|一个新的字符串，该字符串值包含 stringObject 的一个子字符串，其内容是从 start 处到 stop-1 处的所有字符，其长度为 stop 减 start。<br>substring() 方法返回的子串包括 start 处的字符，但不包括 stop 处的字符。|
|Object.assign()|用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。|Object.assign(target, ...sources)|target，目标对象。<br>sources，源对象。|目标对象。|
|forEach()|用于调用数组的每个元素，并将元素传递给回调函数|array.forEach((currentValue, index, arr) => {}, thisValue)|(currentValue, index, arr) => {}，必需。 数组中每个元素需要调用的函数。<br>currentValue，必需。当前元素；<br>index，可选。当前元素的索引值。<br>arr，可选。当前元素所属的数组对象。<br>thisValue，可选。传递给函数的值一般用 "this" 值。如果这个参数为空， "undefined" 会传递给 "this" 值|undefined|
|match()|可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配|stringObject.match(searchvalue)<br>stringObject.match(regexp)|searchvalue，必需。规定要检索的字符串值。<br>regexp，必需。规定要匹配的模式的 RegExp 对象。如果该参数不是 RegExp 对象，则需要首先把它传递给 RegExp 构造函数，将其转换为 RegExp 对象。|存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。[详细介绍](http://www.w3school.com.cn/jsref/jsref_match.asp)|
|concat()|用于连接两个或多个数组。|arrayObject.concat(arrayX,arrayX,......,arrayX)|arrayX，必需。该参数可以是具体的值，也可以是数组对象。可以是任意多个。|返回一个新的数组。该数组是通过把所有 arrayX 参数添加到 arrayObject 中生成的。如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组。|
|charCodeAt()|可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。|stringObject.charCodeAt(index)|index，必需。表示字符串中某个位置的数字，即字符在字符串中的下标。|返回的是位于指定位置的字符的编码；<br>字符串中第一个字符的下标是 0。如果 index 是负数，或大于等于字符串的长度，则 charCodeAt() 返回 NaN。|
|Math.max()|返回一组数中的最大值|Math.max(value1[,value2, ...])|value1, value2, ...，一组数值|返回给定的一组数字中的最大值。如果给定的参数中至少有一个参数无法被转换成数字，则会返回 NaN|
|Math.min()|返回零个或更多个数值的最小值|Math.min([value1[,value2, ...]])|value1, value2, ...一组数值|给定数值中最小的数。如果任一参数不能转换为数值，则返回NaN。|
|Math.floor()|返回小于或等于一个给定数字的最大整数。<br>Math.floor() === 向下取整|Math.floor(x) | x，一个数字。|一个表示小于或等于指定数字的最大整数的数字|
|Math.ceil()|返回大于或等于一个给定数字的最小整数。<br>Math.ceil() === 向上取整|Math.ceil(x) |x，一个数值|大于或等于给定数字的最小整数|
|Math.random()|函数返回一个浮点,  伪随机数在范围[0，1)，<br>也就是说，从0（包括0）往上，但是不包括1（排除1），然后您可以缩放到所需的范围。<br>实现将初始种子选择到随机数生成算法;<br>它不能被用户选择或重置。|Math.random()|-|一个浮点型伪随机数字，在0（包括0）和1（不包括）之间。|
|Math.abs()|函数返回指定数字 “x“ 的绝对值|Math.abs(x);|x，一个数值|传入一个非数字形式的字符串或者 undefined/empty 变量，将返回 NaN。传入 null 将返回 0。|
|charAt()|可返回指定位置的字符|stringObject.charAt(index)|index	必需。表示字符串中某个位置的数字，即字符在字符串中的下标。|返回指定位置的字符<br>字符串中第一个字符的下标是 0。如果参数 index 不在 0 与 string.length 之间，该方法将返回一个空字符串。|
|toUpperCase()|用于把字符串转换为大写|stringObject.toUpperCase()|-|一个新的字符串，在其中 stringObject 的所有小写字符全部被转换为了大写字符|
|substr()|可在字符串中抽取从 start 下标开始的指定数目的字符。|stringObject.substr(start,length)|start	必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。<br><br>length	可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。|一个新的字符串，包含从 stringObject 的 start（包括 start 所指的字符） 处开始的 length 个字符。如果没有指定 length，那么返回的字符串包含从 start 到 stringObject 的结尾的字符。|

# 4. 去掉项目中的 eslint 检测
` 在 package.json 文件中 找到 "extends" 删除 "eslint: ' '" 项即可. `

# 5. 利用 vue-lazyload 插件实现图片懒加载
1. 安装 `vue-lazyload` 插件 `yarn add vue-lazyload --save` 或 `npm install vue-lazyload --save`
2. 在 `main.js` 文件中引用，代码如下：
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  error: require('dist/error.png'), // 加载失败时显示的图片
  loading: require('dist/loading.gif'), // 预先显示的图片
  attempt: 1, // 尝试计数
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
```
3. 然后在你需要懒加载图片的地方使用
```html
<template>
  <img width="60" height="60" v-lazy="请求的图片地址" alt="">
</template>
```
4. 具体API，查看[vue-lazyload  github官方网站](https://github.com/hilongjw/vue-lazyload)
