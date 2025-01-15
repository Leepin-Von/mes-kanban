import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem('Authorization') || ''
  },
  getters: {
  },
  mutations: {
    /**
     * 本地存储用户登录信息
     * @param {object} state Vuex.Store 中的 state
     * @param {object} user 用户登录信息
     */
    changeLogin (state, user) {
      state.Authorization = user.Authorization
      localStorage.setItem('Authorization', user.Authorization)
    }
  },
  actions: {
  },
  modules: {
  }
})
