<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',

  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    }
  },

  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },

  methods: {
    /**
     * 禁用 better-scroll 的DOM 事件(如 touchstart,touchmove,touchend)的回调函数不再响应
     */
    disable() {
      this.scroll && this.scroll.disable()
    },

    /**
     * 启用 better-scroll, 默认 开启
     */
    enable() {
      this.scroll && this.scroll.enable()
    },

    /**
     * 重新计算 better-scroll,当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
     */
    refresh() {
      this.scroll && this.scroll.refresh()
    },

    /**
     * 滚动到指定的位置
     */
    scrollTo() {
      this.scroll && this.scrollTo.apply(this.scroll, arguments)
    },

    /**
     * 滚动到指定的目标元素
     */
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    
    /**
     * 初始化better-scroll
     */
    _initScroll() {
      if (!this.$refs.wrapper) return
      // 初始化 scroll 
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 是否监听滚动
      if (this.listenScroll) {
        let _me = this
        this.scroll.on('scroll', (pos) => {
          // 监听滚动,派发滚动事件
          _me.$emit('scroll', pos)
        })
      }
    }
  },

  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
