<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(item, index) in songs"
        :key="item.id"
        @click="selectedItem(item, index)"
      >
        <div class="rank" v-show="rank">
          <span class=""></span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-list',

  props: {
    songs: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * 一个选择播放音乐的方法
     * @param {*} item 当前点击歌曲项
     * @param {*} index 当前点击歌曲在列表的索引
     */
    selectedItem(item, index) {
      this.$emit('select', item, index)
    },
    /**
     * 一个构造歌曲的歌手详情的方法
     * @param {*} song 当前歌曲项
     */
    getDesc(song) {
      return `${song.singer} · ${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.song-list
  .item
    display: flex
    align-items: center
    box-sizing: border-box
    height: 64px
    font-size: $font-size-medium
    .rank
      display: flex
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
</style>

