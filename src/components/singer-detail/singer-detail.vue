<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSingerDetail} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/common/js/song'

export default {
  name: 'singer-detail',

  data() {
    return {
      songs: []
    }
  },
  
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },

  created() {
    this._getSingerDetail(this.singer.id)
  },

  methods: {
    /**
     * 一个获取歌手详情的方法
     * @param {*} 歌手 Id
     */
    _getSingerDetail(id) {
      // 当取不到歌手 ID 时返回上一页
      if (!this.singer.id) {
        this.$router.back()
        return
      }
      // 获取歌手数据
      getSingerDetail(id).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          const {list} = res.data
          this.songs = this._normalizeSinger(list)
        }
      })
    },

    /**
     * 一个格式化歌曲数据格式的方法
     * @param {*} list 歌手的歌曲数据
     */
    _normalizeSinger(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        // 当有歌曲 ID 和 专辑 ID 
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },

  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
