<template>
  <div class="loading">
    <img height="24" width="24" src="./loading.gif" alt="loading">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'loading',

  props: {
    title: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.loading
  width: 100%
  text-align: center
  .desc
    line-height: 20px
    font-size: $font-size-small
    color: $color-text-l
</style>

