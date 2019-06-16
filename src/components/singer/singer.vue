<template>
  <div class="singer">
    <listview @select="selectedSinger" :data="singerLists"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import Listview from '@/base/listview/listview'
import { getSingerList } from '@/api/singer.js'
import {ERR_OK} from '@/api/config'
import Singer from '@/common/js/singer'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',

  data() {
    return {
      singerLists: [], // 歌手列表数据
    }
  },

  created() {
    this._getSingerList()
  },

  methods: {
    selectedSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          const {list} = res.data
          this.singerLists = this._normalizeSinger(list)
          console.log(this.singerLists)
        }
      })
    },

    _normalizeSinger(list) {
      // 构造数据模型
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      // 遍历数据,构造数据
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }

        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })

      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },

  components: {
    Listview
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    z-index: 100
</style>
