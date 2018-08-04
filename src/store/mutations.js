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
  },
  [types.SET_guideMC] (state, guideMC) {
    state.guideMC = guideMC
  },
  [types.SET_settledEnterData] (state, settledEnterData) {
    state.settledEnterData = settledEnterData
  },
  [types.SET_settledCardData] (state, settledCardData) {
    state.settledCardData = settledCardData
  }
  
}

export default matutaions
