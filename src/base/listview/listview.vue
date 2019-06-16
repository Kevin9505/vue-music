<template>
  <scroll
    class="listview"
    :data="data"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    ref="listview"
    @scroll="scroll"
  >
    <ul>
      <li
        class="list-group"
        v-for="group in data"
        :key="group.index"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item in group.items"
            :key="item.id"
            @click="selectedSinger(item)"
          >
            <img class="avatar" v-lazy="item.avatar" :alt="item.name">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li 
          class="item"
          v-for="(list, index) in shortcutList"
          :class="{'current' : currentIndex === index}"
          :key="index"
          :data-index="index"
        >
          {{list}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {getData} from '@/common/js/dom'

// 右侧快速入口的标签高度
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'listview',

  props: {
    data: {
      Type: Array,
      default: []
    }
  },

  data() {
    return {
      currentIndex: 0, // 当前选中的索引
      scrollY: -1,
      diff: -1
    }
  },

  watch: {
    /**
     * 监听数据的变量,计算每一个区块的高度
     */
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },

    /**
     * 监听 在 Y 轴的滚动
     */
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部时, newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      // 在中间部分滚动时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }

      // 当滚动到底部,且 -newY 大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },

    /**
     * 监听置顶的差值,改变置顶偏移
     */
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },

  computed: {
    /**
     * 计算出右侧字母列表数据
     */
    shortcutList() {
      return this.data.map(el => el.title.substr(0, 1))
    },

    /**
     * 计算置顶的显示内容
     */
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },

  created() {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
  },

  methods: {
    selectedSinger(item) {
      this.$emit('select', item)
    },
    /**
     * 手指触摸开始时触发的方法
     * @param {*} e 事件源
     */
    onShortcutTouchStart(e) {
      // 获取当前点击的索引
      let currentTouchIndex = getData(e.target, 'index')
      // 取出当前点击的标签
      let firstTouch = e.touches[0]
      // 获取到当前点击的 Y 轴位置,设为全局变量
      this.touch.y1 = firstTouch.pageY
      // 将当前点击的索引设为全局变量
      this.touch.currentTouchIndex = currentTouchIndex
      this._scrollTo(currentTouchIndex)
    },

    /**
     * 手指滑动时触发的方法
     * @param {*} e 事件源
     */
    onShortcutTouchMove(e) {
      // 获取当前滑动时触摸的对象
      let firstTouch = e.touches[0]
      // 获取在 Y 轴上的距离
      this.touch.y2 = firstTouch.pageY
      // 获取到当前滑动的 位置
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 计算最终的 滑动 位置
      let currentTouchIndex = parseInt(this.touch.currentTouchIndex) + delta
      // 滚动到相应位置
      this._scrollTo(currentTouchIndex)
    },

    /**
     * 重新计算 better-scroll,当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
     */
    refresh() {
      this.$refs.listview.refresh()
    },

    /**
     * 滚动事件
     */
    scroll(pos) {
      this.scrollY = pos.y
    },

    /**
     * 获取全部区块的高度集合
     */
    _calculateHeight() {
      this.listHeight = []
      // 获取所有的区块
      const list = this.$refs.listGroup
      // 初始高度
      let height = 0
      this.listHeight.push(height)
      // 循环遍历区块,计算滚动到下一个区块的高度
      list.forEach(el => {
        height += el.clientHeight
        this.listHeight.push(height)
      })
    },

    /**
     * 滚动到指定的目标元素
     */
    _scrollTo(index) {
      console.log(index)
      // 当触摸右侧顶部空白处时不触发
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      // 第二个参数是滚动时的动画时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },

  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
