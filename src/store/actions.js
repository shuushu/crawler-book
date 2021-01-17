import firebase from 'firebase'
import { put, call, delay } from "vuex-saga"
import ROOT from './constant'

export default {
  *loginEmail({}, { id, pw }) {
    yield put(ROOT.LOGIN_EMAIL_REQ_WAIT)

    let auth = yield call(() => {
      return new Promise((resolve) => {
        firebase.auth().signInWithEmailAndPassword(id, pw)
          .catch(error => {
            resolve({ ...error, state: false })
            this.commit(ROOT.LOGIN_EMAIL_REQ_FAIL)
          })
          .then(result => {
            if (result) {
              resolve({ state: true });
              this.commit(ROOT.LOGIN_EMAIL_REQ_SUCCESS)
            }
          });
      })
    });

    return auth;
  },
  *createMailID(store, { id, pw, name }) {
    yield put(ROOT.CREATE_AUTH_REQ_WAIT)

    let auth = yield call(() => {
      return new Promise((resolve) => {
        firebase.auth().createUserWithEmailAndPassword(id, pw)
          .catch(error => {
            this.commit(ROOT.CREATE_AUTH_REQ_FAIL)
            resolve({ ...error, state: false })
          })
          .then(result => {
            if (result) {
              let userData = {}

              userData[result.user.uid] = {
                email: id,
                displayName: name,
                photoURL: 'http://placehold.it/60x60',
                uid: result.user.uid
              }

              firebase.database().ref('books/users').update(userData);
              this.commit(ROOT.CREATE_AUTH_REQ_SUCESS)
              resolve({ state: true });
            }
          })
      })
    });

    return auth;
  },
  *loginGoogle() {
    yield put(ROOT.LOGIN_GOOGLE_AUTH_REQ_WAIT)

    let auth = yield call(() => {
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
            }, { state: true }));

            firebase.database().ref('books/users').child(uid).set({
              displayName, uid, email, photoURL
            });

            this.commit(ROOT.LOGIN_GOOGLE_AUTH_REQ_SUCCESS)
          }
        }).catch(error => {
          resolve({ ...error, state: false });
          this.commit(ROOT.LOGIN_GOOGLE_AUTH_REQ_FAIL)
        });
      })
    });

    return auth;
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
                store.commit(ROOT.SESSION_AUTH, result.val())
                resolve(result.val())
              })
            } else {
              store.commit(ROOT.SESSION_OUT, null)
            }
          })
        } else {
          resolve(auth)
        }
      })
    })


    return result
  },
  *logout() {
    let result = yield call(() => {
      return new Promise(resolve => {
        firebase.auth().signOut().then(() => {
          resolve(true)
        }).catch(error => {
          resolve(false, error)
        });
      })
    });
    return result;
  },
  *dialogAlert(store, params) {
    yield put(ROOT.POPUP_ALERT, params)
  },
  *dialogConfirm(store, params) {
    yield put(ROOT.POPUP_CONFIRM, params)
  }
}
