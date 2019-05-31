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

