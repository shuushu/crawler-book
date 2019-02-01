import Vue from 'vue'
import Vuex from 'vuex'
import bookList from './modules/bookList'
import rental from './modules/rental'

import rootState from './state'
import rootActions from './actions'
import rootMutations from './mutations'
// Install it by pass your store to be an option argument (Since v0.1.0)
Vue.use(Vuex);

let store = new Vuex.Store({
  state: rootState,
  actions: rootActions,
  mutations: rootMutations,

  modules: {
    bookList,
    rental
  }
});

export default store;
