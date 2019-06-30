<template>
  <div class="progress-bar" ref="progressBar" @click="progressBarClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from '@/common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  name: 'progress-bar',

  props: {
    percent: {
      type: Number,
      default: 0
    }
  },

  watch: {
    /**
     * 监听当前歌曲播放的进度
     */
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 计算当前播放的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 偏移的百分比
        const offsetWidth = newPercent * barWidth
        // 执行设置
        this._offset(offsetWidth)
      }
    }
  },

  created() {
    this.touch = {}
  },

  methods: {
    /**
     * 一个播放进度条拖动开始的方法
     */
    progressTouchStart(e) {
      // 记录触摸开始
      this.touch.initiated = true
      // 记录触摸开始的位置
      this.touch.startX = e.touches[0].pageX
      // 记录当前播放进度已经有的进度
      this.touch.left = this.$refs.progress.clientWidth
    },
    /**
     * 一个播放进度条正在头动的方法
     */
    progressTouchMove(e) {
      if (!this.touch.initiated) return false
      // 记录拖动的距离
      const deltaX  = e.touches[0].pageX - this.touch.startX
      // 计算出偏移值
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      // 执行设置方法
      this._offset(offsetWidth)
    },
    /**
     * 一个播放进度条拖动结束的方法
     */
    progressTouchEnd() {
      // 拖动结束后,将初始值设置 false
      this.touch.initiated = false
      this._triggerPercent()
    },
    /**
     * 一个点击总进度条触发的方法
     */
    progressBarClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    /**
     * 一个拖动播放进度条的触发播放音乐时间的方法
     */
    _triggerPercent() {
      // 当前总进度条的长度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 播放进度占全部的比率
      const percent = this.$refs.progress.clientWidth / barWidth
      // 派发事件
      this.$emit('percentChange', percent)
    },
    /**
     * 设置当前歌曲的播放进度的偏移值
     */
    _offset(offsetWidth) {
      // 设置已经播放的进度宽度
      this.$refs.progress.style.width = `${offsetWidth}px`
      // 设置进度小按钮的偏移位置
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border-radius: 50%
        background: $color-theme
</style>
