import firebase from 'firebase'
import rootMutations from '../mutations'
import { put, call, delay } from "vuex-saga";
import ROOT, { RENT } from '../constant'
import { index } from "../../common/config";

let state = {
  item: null
}

const mutations = {
  GET_RENTLIST: (state, data) => {
    state.item = data
  }
}

const actions = {
  *getRentList (store, uid) {
    if (state.item) return;

    yield put(ROOT.GET_RENTLIST_REQ_WAIT)

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
                  this.commit(RENT.GET_RENTLIST, obj);
                  this.commit(ROOT.GET_RENTLIST_REQ_SUCCESS)
                }
              })
            }
          } else {
            this.commit(RENT.GET_RENTLIST, false);
            this.commit(ROOT.GET_RENTLIST_REQ_FAIL)
          }
        })
      })
    });
  },
  *removeItem (store, key) {
    yield put(ROOT.REMOVE_RENT_REQ_WAIT)


    yield call(() => {
      return new Promise(resolve => {
        firebase.database().ref(`books/rent/${key}`).set(null);
        firebase.database().ref(`books/list/${key}/state`).set(2);

        // searchDB
        index.partialUpdateObjects([{
          state: 2,
          objectID: key
        }], err => {
          if (err) {
            this.commit(ROOT.REMOVE_RENT_REQ_FAIL)
            resolve(false)
          } else {
            this.commit(ROOT.REMOVE_RENT_REQ_SUCCESS)
            resolve(true)
          }
        });
      })
    })

  }
}


export default {
  namespaced: true,
  state,
  actions,
  rootMutations,
  mutations
}
