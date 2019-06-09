<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="recommendSongList">
      <div>
        <div class="slider-wrapper">
          <slider v-if="recommendSliders.length">
            <div v-for="item in recommendSliders" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl" :alt="item.id">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in recommendSongList" :key="item.id">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picUrl" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListAuthor}}</h2>
                <p class="desc">{{item.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!recommendSongList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
export default {
  name: 'recommend',

  data() {
    return {
      recommendSliders: [], // 轮播图数据
      recommendSongList: [], // 热门歌单数据
    }
  },

  created() {
    this._getRecommend()
  },

  methods: {
    /**
     * 获取 QQ音乐 的数据
     */
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          const {slider, songList} = res.data
          console.log(res)
          this.recommendSliders = slider
          this.recommendSongList = songList
        }
      })
    },
    
    /**
     * 确保轮播图已经加载,计算 scroll 的高度
     */
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
  },

  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
