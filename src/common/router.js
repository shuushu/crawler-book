import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from "firebase";
import store from '../store'

Vue.use(VueRouter);
Vue.component('router-link', Vue.options.components.RouterLink);
Vue.component('router-view', Vue.options.components.RouterView);

const routerMap = [
  { name: 'login', path: '/login', component: '/Login'},
  { name: 'list', path: '/list', component: '/List'},
  { name: 'write', path: '/write', component: '/Write'},
  { name: 'rental', path: '/rental', component: '/Rental'},
];

const redirectRoute = [
  { path: '/', redirect: 'login' }
];

const routes = [...routerMap.map(route => {
  const { name, path, component } = route;
  return {
    path,
    name,
    component: () => import(/* webpackChunkName: "container" */  `../container${component}`)
  }
}), ...redirectRoute];

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
});



router.beforeEach((to, from, next) => {
  // 로그인 인증상태
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (!store.state.auth) {
        firebase.database().ref(`books/users/${user.uid}`).once('value').then(result => {
          store.commit('SESSION_AUTH', result.val())
        })
      }

      if (to.name === 'login') {
        // 홈으로 이동
        next('/list')
      } else {
        // 현재페이지
        next()
      }
    } else {
      store.commit('SET_AUTH', null)
      // 비로그인 > 경로가 로그인 페이지이면
      if(to.name === 'login') {
        next()
      } else {
        next('/login')
      }
    }
  });

});

export default router
