import * as types from './mutations-types'

// 退出时，清空部分数据
export const dropOut = function ({commit, state}) {
  commit(types.SET_settledEnterData, '')
  commit(types.SET_settledCardData, '')
  commit(types.SET_userInfo, {})
  commit(types.SET_avatar, '')
  commit(types.SET_guideMC, [])
}
