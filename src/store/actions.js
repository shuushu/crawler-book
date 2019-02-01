import firebase from 'firebase'
import mutations from './mutations'
import { put, call, delay } from "vuex-saga";

export default {
  *loginEmail({}, { id, pw }) {
    yield put(mutations.REQ_WAIT.name)

    let auth = yield call(() => {
      return new Promise((resolve) => {
        firebase.auth().signInWithEmailAndPassword(id, pw)
          .catch(error => {
            resolve(Object.assign(error, {state: 'FAIL'}));
          })
          .then(result => {
            if (result) {
              let { displayName, uid, email, photoURL } = result;

              resolve(Object.assign({
                displayName,
                uid,
                email,
                photoURL
              }, {state: 'SUCCESS'}));

            }
          });
      })
    });

    if (auth.state === 'FAIL') {
      yield put(mutations.REQ_FAIL.name);
      return auth
    } else {
      yield put(mutations.SET_AUTH.name, auth);
      yield put(mutations.REQ_SUCESS.name)
      return auth
    }
  },
  *createMailID(store, { id, pw, name }) {
    yield put(mutations.REQ_WAIT.name)

    let auth = yield call(() => {
      return new Promise((resolve) => {
        firebase.auth().createUserWithEmailAndPassword(id, pw)
          .catch(error => {
            resolve(Object.assign(error, {state: 'FAIL'}));
          })
          .then(result => {
            if (result) {
              let userData = {}

              userData[result.uid] = {
                email: id,
                displayName: name,
                photoURL: 'http://placehold.it/60x60',
                uid: result.uid
              }

              firebase.database().ref('books/users').update(userData);
              resolve(Object.assign(userData, {state: 'SUCCESS'}));
            }
          })
      })
    });

    if (auth.state === 'FAIL') {
      yield put(mutations.REQ_FAIL.name);
      return auth
    } else {
      yield put(mutations.SET_AUTH.name, auth);
      yield put(mutations.REQ_SUCESS.name)
      return auth
    }
  },
  *loginGoogle() {
    yield put(mutations.REQ_WAIT.name)

    let auth = yield call(function() {
      return new Promise((resolve) => {

        let provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        firebase.auth().signInWithPopup(provider).then(result => {
          if (result) {
            let { displayName, uid, email, photoURL } = result.user;

            resolve(Object.assign({
              displayName,
              uid,
              email,
              photoURL
            }, {state: 'SUCCESS'}));

            firebase.database().ref('books/users').child(uid).set({
              displayName, uid, email, photoURL
            })
          }
        }).catch(error => {
          resolve(Object.assign(error, {state: 'FAIL'}));
        });


      })
    });

    yield put(mutations.SET_AUTH.name, auth)
    yield put(mutations.REQ_SUCESS.name)
  },
  *getSession(store) {
    let { auth } = store.state;

    let result = yield call(() => {
      return new Promise(resolve => {
        if (auth === null) {
          // 로그인 인증상태
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              firebase.database().ref(`books/users/${user.uid}`).once('value').then(result => {
                store.commit('SESSION_AUTH', result.val())
                resolve(result.val())
              })
            } else {
              store.commit('SESSION_OUT', null)
            }
          })
        } else {
          resolve(auth)
        }
      })
    })


    return result
  }
}
