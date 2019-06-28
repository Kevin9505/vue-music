/**
 * @time 2019-6-22
 * @by lkfeng2016@163.com
 * @desc vuex 提交 mustation 的方法
 */

import * as types from './mutation-types'

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}