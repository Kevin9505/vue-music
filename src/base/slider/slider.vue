<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active : currentPageIndex === index}">{{item}}</span>
    </div>
  </div>
</template>

<script>
import { addClass } from '@/common/js/dom'
import BScroll from 'better-scroll'
export default {
  name: 'slider',

  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    initerval: {
      type: Number,
      default: 1000
    }
  },

  data() {
    return {
      dots: [], // 小圆点的个数
      currentPageIndex: 0
    }
  },

  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  
  activated() { // keep-alive 组件激活时调用。
    if (this.autoPlay) {
      this._play()
    }
  },

  methods: {
    /**
     * 一个计算轮播图的方法
     */
    _setSliderWidth(isResize) {
      // 取出全部的轮播内容
      this.children = this.$refs.sliderGroup.children
      // 定义宽高
      let width = 0
      // 获取当前屏幕的宽度
      let sliderWidth = this.$refs.slider.clientWidth
      // 循环遍历数组
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        // console.log(child)
        // 给当前每个标签添加类
        addClass(child, 'slider-item')
        // 设置每个标签的宽度
        child.style.width = sliderWidth + 'px'
        // 计算全部标签的宽度
        width += sliderWidth
      }
      // 判断是否为支持循环轮播
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 给标签赋值
      this.$refs.sliderGroup.style.width = width + 'px'
    },

    /**
     * 一个BScroll的初始值
     */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        startX: 0,
        scrollX: true,
        scrollY: false,
        momentum: true,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          stepX: 0,
          stepY: 0,
          speed: 400
        }
      })
      // 监听滚动结束触发的方法
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex = this.slider.getCurrentPage().pageX
        }

        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },

    /**
     * 初始化小圆点
     */
    _initDots() {
      this.dots = new Array(this.children.length)
    },

    _play() {
      let pageIndex = this.currentPageIndex
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        if (pageIndex >= 5) {
          this.currentPageIndex = 0
          pageIndex = 0
        }
        // this.slider.goToPage(pageIndex, 0, 400)
        this.slider.next(400)
      }, this.initerval)
    }
  },

  deactivated() { // keep-alive 组件停用时调用。
    clearTimeout(this.timer)
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  .slider
    min-height: 1px
    position: relative
    .slider-group
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 10px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

