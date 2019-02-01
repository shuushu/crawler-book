import firebase from 'firebase'
import rootMutations from '../mutations'
import { put, call, delay } from "vuex-saga";

let state = {
  item: null
}

const mutations = {
  RENTLIST: (state, data) => {
    state.item = data
  },
  REMOVE_RENT_ITEM: (state, data) => {

  }
}

const actions = {
  *list (store, uid) {
    if (state.item) return;

    yield put(rootMutations.REQ_WAIT.name)

    yield call(() => {
      return new Promise(() => {
        firebase.database().ref('books/rent').orderByValue().equalTo(uid).on('value', (res) => {
          if (res.val()) {
            let size = Object.keys(res.val()).length, cnt = 0, obj = {};

            for(let bookID in res.val()) {
              firebase.database().ref(`books/list/${bookID}`).once('value').then(snap => {
                cnt++;
                obj[bookID] = snap.val();
                // 조회완료
                if (cnt >= size) {
                  this.commit(`rental/${mutations.RENTLIST.name}`, obj);
                  this.commit(rootMutations.REQ_SUCESS.name)
                }
              })
            }
          } else {
            this.commit(`rental/${mutations.RENTLIST.name}`, false);
            this.commit(rootMutations.REQ_FAIL.name)
          }
        })
      })
    });
  },
  *removeItem (store, key) {
    firebase.database().ref(`books/rent/${key}`).set(null);
    firebase.database().ref(`books/list/${key}/state`).set(0);
    yield put(`rental/${mutations.REMOVE_RENT_ITEM.name}`)
    return true
  }
}


export default {
  namespaced: true,
  state,
  actions,
  rootMutations,
  mutations
}
