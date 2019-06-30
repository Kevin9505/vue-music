<template>
  <div class="player">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" :alt="currentSong.id">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" :alt="currentSong.id">
              </div>
            </div>
            <div class="playing-kyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrapper">
              <div>
                <p class="text"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="progressBarChangeByPercent"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :class="cdCls" :src="currentSong.image" :alt="currentSong.id">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniPlayIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @play="readPlay" @error="playError" @timeupdate="updatePlayTime"></audio>
  </div>
</template>

<script>
import ProgressBar from '@/base/progress-bar/progress-bar'
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '@/common/js/dom'

const transform = prefixStyle('transform')

export default {
  name: 'player',

  data() {
    return {
      hadReadPlay: false, // 当前歌曲是否准备好
      currentTime: 0 // 当前播放的进度时间
    }
  },

  computed: {
    /**
     * 计算中间 cd 的旋转样式
     */
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    /**
     * 计算全屏的播放按钮样式
     */
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    /**
     * 计算小屏的播放按钮样式
     */
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls() {
      return this.hadReadPlay ? '' : 'disable'
    },
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playing',
      'currentIndex',
      'playlist'
    ])
  },

  watch: {
    /**
     * 监听当前播放歌曲的变化
     */
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    /**
     * 监听当前的播放状态
     */
    playing() {
      const audio = this.$refs.audio
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(playPromise)
          this.$nextTick(() => {
            this.playing ? audio.play() : audio.pause()
          })
        })
      }
    }
  },

  methods: {
    /**
     * 小屏播放
     */
    back() {
      this.setFullScreen(false)
    },
    /**
     * 全屏播放
     */
    open() {
      this.setFullScreen(true)
    },
    /**
     * 定义进入过渡的开始状态
     */
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      // 动画对象
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      // 注册一个动画
      animations.registerAnimation({
        name: 'move', // 动画的名称
        animation, // 动画对象
        presets: {
          duration: 400, // 持续时间
          easing: 'linear'
        }
      })

      // 对应的标签执行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    /**
     *  定义进入过渡的结束状态
     */
    afterEnter() {
      // 注销掉动画
      animations.unregisterAnimation('move')
      // 将标签的动画样式清除
      this.$refs.cdWrapper.style.animation = ''
    },
    /**
     * 定义离开过渡的开始状态
     */
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // 监听动画结束事件
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    /**
     * 定义离开过渡的结束状态
     */
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    /**
     * 点击切换播放暂停歌曲事件
     */
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    /**
     * 上一首歌曲的方法
     */
    prevSong() {
      // 当当前播放歌曲未准备好前不会执行后面的逻辑
      if (!this.hadReadPlay) return
      // 上一首歌曲的索引
      let index = this.currentIndex - 1
      // 判断当前歌曲是否为第一条
      if (index === -1) {
        index = this.playlist.length - 1
      }
      // 利用 vuex 设置当前索引
      this.setCurrentIndex(index)
      // 判断当前歌曲正在播放时,切换图标
      if (!this.playing) {
        this.togglePlaying()
      }
      // 将 歌曲准备好的变量值改为 false
      this.hadReadPlay = false
    },
    /**
     * 下一首歌曲的方法
     */
    nextSong() {
      // 当当前播放歌曲未准备好前不会执行后面的逻辑
      if (!this.hadReadPlay) return false
      // 下一首歌曲的索引
      let index = this.currentIndex + 1
      // 判断当前歌曲是否为列表中的最后一条
      if (index === this.playlist.length) {
        index = 0
      }
      // 利用 vuex 设置当前索引
      this.setCurrentIndex(index)
      // 判断当前歌曲正在播放时,切换图标
      if (!this.playing) {
        this.togglePlaying()
      }
      // 将 歌曲准备好的变量值改为 false
      this.hadReadPlay = false
    },
    /**
     * 歌曲准备好后执行的方法 audio 标签的内置方法
     */
    readPlay() {
      this.hadReadPlay = true
    },
    /**
     * 歌曲播放错误执行的方法
     */
    playError() {
      this.hadReadPlay = true
    },
    /**
     * 音乐播放时间进度
     */
    updatePlayTime(e) {
      this.currentTime = e.target.currentTime
    },
    /**
     * 时间格式化的方法
     */
    formatTime(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    /**
     * 根据拖动进度条改变当前播放时间的方法
     * @param {*} percent 当前拖动的比率
     */
    progressBarChangeByPercent(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    /**
     * 一个根据 n 给 num 补充的方法
     * @param {*} num 当前需要操作的值
     * @param {*} n 当前需要补充的长度
     */
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    /**
     * 获取唱片移动的位置
     */
    _getPosAndScale() {
      // 小唱片的大小
      const targetWidth = 40
      // 小唱片距离左侧的距离
      const paddingLeft = 40
      // 小唱片距离下侧的距离
      const paddingBottom = 30
      // 大唱片距离顶部的距离
      const paddingTop = 80
      // 大唱片的大小
      const width = window.innerWidth * 0.8
      // 缩放比例
      const scale = targetWidth / width
      // 距离 x 轴的位置
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 距离 y 轴的位置
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  components: {
    ProgressBar
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'

.player
  .normal-player
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle  
      position: fixed
      top: 80px
      bottom: 170px
      width: 100%
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          top: 0
          left: 10%
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              top: 0
              left: 0
              width: 100%
              height: 100%
              border-radius: 50%
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform:translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    bottom: 0
    left: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 32px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        top: 0
        left: 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
