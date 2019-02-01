import Vue from 'vue'
import App from './App.vue'

import VueMaterial from 'vue-material';
import router from './common/router';
import VuexSaga from "vuex-saga";

import firebase from 'firebase';

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here

import store from './store';

// Make A Vuex Store
Vue.use(VuexSaga, { store: store })

const fbConfig = {
  apiKey: "AIzaSyBwc5tkZM3fEQcyPC1-HfguTbIt8woO9iA",
  authDomain: "shushu-cb26c.firebaseapp.com",
  databaseURL: "https://shushu-cb26c.firebaseio.com",
  storageBucket: "shushu-cb26c.appspot.com"
};

firebase.initializeApp(fbConfig);

Vue.use(VueMaterial);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');