import * as types from './mutations-types'

const matutaions = {
  [types.SET_avatar] (state, avatar) {
    state.avatar = avatar
  },
  [types.SET_userInfo] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_bulkyCargo] (state, bulkyCargo) {
    state.bulkyCargo = bulkyCargo
  }
}

export default matutaions
