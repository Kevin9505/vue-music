/**
 * @time 2019-6-22
 * @by lkfeng2016@163.com
 * @desc vuex 的状态仓库管理文件
 */

import {playMode} from '@/common/js/config'

const state = {
  singer: {}, // 歌手项数据
  playing: false, // 正在播放
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode, // 播放模式, 0 顺序 1 循环 2 随机
  currentIndex: -1 // 当前播放的歌曲索引
}

export default state
