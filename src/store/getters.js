/**
 * @time 2019-6-22
 * @by lkfeng2016@163.com
 * @desc vuex 获取 store 仓库的方法文件
 */

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
