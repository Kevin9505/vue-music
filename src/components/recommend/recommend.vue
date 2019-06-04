<template>
  <div class="recommend">
    <slider v-if="recommends.length">
      <div v-for="item in recommends" :key="item.id">
        <a :href="item.linkUrl">
          <img :src="item.picUrl" :alt="item.id">
        </a>
      </div>
    </slider>
  </div>
</template>

<script>
import { getRecommend } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import Slider from '@/base/slider/slider'
export default {
  name: 'recommend',

  data() {
    return {
      recommends: []
    }
  },

  created() {
    this._getRecommend()
  },

  methods: {
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          const {slider} = res.data
          this.recommends = slider
        }
      })
    }
  },

  components: {
    Slider
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
</style>
