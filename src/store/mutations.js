import { put, call } from 'vuex-saga'

export default {
  REQ_WAIT: (state) => {
    state.ready = true;
  },
  REQ_SUCESS: (state) => {
    state.ready = false;
  },
  REQ_FAIL: (state) => {
    state.ready = false;
  },
  SET_AUTH: (state, data) => {
    state.auth = data;
  },
  SESSION_AUTH: (state, data) => {
    state.auth = data;
  },
  SESSION_OUT: (state, data) => {
    state.auth = data;
  },
}
