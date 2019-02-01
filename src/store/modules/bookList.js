import firebase from 'firebase'
import rootMutations from '../mutations'
import { put, call, delay } from "vuex-saga";

let state = {
  rental: null,
  item: null,
  users: null,
  page: 1
}

const getters = {
  rentable: state => {
    if (state.item) {
      let keys = Object.keys(state.item);
      let filter = keys.reduce((temp, key) => {
        if (state.item[key].state === 0) {
          temp[key] = state.item[key]
        }

        return temp;
      }, {});

      return Object.keys(filter).length > 0  ? filter : false;
    }
  }
}

const mutations = {
  BOOK: (state, data) => {
    state.item = data
  },
  PAGE: (state, data) => {
    if (data !== false) {
      state.page = state.page + data
    } else {
      state.page = false;
    }
  },
  RENTAL: (state, data) => {
    state.rental = data;
  },
  USERS: (state, data) => {
    state.users = data;
  },
  FILTER: (state, data) => {
    state.item = data
  },
}


const querySelectAll = (store, PATH) => {
  let DB;

  if (PATH.hasOwnProperty('option')) {
    if(PATH.option = 'limitToLast') {
      DB = firebase.database().ref(PATH.ref).limitToLast(state.page)
    }
  } else {
    DB = firebase.database().ref(PATH.ref)
  }

  return new Promise(resolve => {
    DB.on('value', data =>  {
      if (data.val()) {
        store.commit(PATH.mutation, data.val())
        store.commit(rootMutations.REQ_SUCESS.name)
      } else {
        store.commit(rootMutations.REQ_FAIL.name)
      }
      resolve(data.val())
    })
  });
}



const actions = {
  *rentBook({}, params) {
    yield put(rootMutations.REQ_WAIT.name)
    // 동시 대여 체크
    let check = yield call(() => {
      return new Promise(resolve => {
        firebase.database().ref(`books/list/${params.key}`).once('value').then(r => {
          if (r.val().state === 1) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
    });

    if (check) {
      let updata = yield call(() => {
        return new Promise(resolve => {
          let updates = {}

          updates[`books/rent/${params.key}`] = params.uid

          firebase.database().ref().update(updates).then((error) => {
            if (error) {
              console.log('Error has occured during saving process')
              this.commit(rootMutations.REQ_FAIL.name)
              resolve(false);
            } else {
              // success
              firebase.database().ref(`books/list/${params.key}/cnt`).set(state.item[params.key].cnt + 1);
              firebase.database().ref(`books/list/${params.key}/state`).set(1);
              this.commit(rootMutations.REQ_SUCESS.name)
              resolve(true);
            }
          });
        })
      });

      return updata
    } else {
      alert('이미 대여중인 도서입니다.')
      this.commit(rootMutations.REQ_FAIL.name)

      return false;
    }
  },
  *init() {
    if (!state.rental || !state.item || !state.users) {
      yield put(rootMutations.REQ_WAIT.name)
    }

    // 렌트정보
    if (state.rental === null) yield call(querySelectAll, this, {
      ref: 'books/rent',
      mutation: 'bookList/RENTAL'
    })

    // 사용자 정보
    if (state.users === null) yield call(querySelectAll, this, {
      ref: 'books/users',
      mutation: 'bookList/USERS'
    })

    // 북정보
    if (state.item === null) yield call(querySelectAll, this, {
      ref: 'books/list',
      mutation: 'bookList/BOOK',
      option: 'limitToLast'
    })
  },
  *setPage({}, cnt) {
    yield put(`bookList/${mutations.PAGE.name}`, cnt);
    yield call(querySelectAll, this, {
      ref: 'books/list',
      mutation: 'bookList/BOOK',
      option: 'limitToLast'
    })

    if (state.page >= Object.keys(state.item).length) {
      yield put(`bookList/${mutations.PAGE.name}`, false);
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  rootMutations,
  mutations
}
