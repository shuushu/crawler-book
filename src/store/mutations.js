import { TYPE } from '../common/config'
import ROOT from './constant'

let obj = {};

TYPE.forEach(value => {
  obj = Object.assign(obj, {
    [ROOT[`${value}_REQ_WAIT`]]: (state) => {
        state.ready = true;
    },
    [`${value}_REQ_SUCCESS`]: (state) => {
      state.ready = false;
    },
    [`${value}_REQ_FAIL`]: (state) => {
      state.ready = false;
    }
  })
});

export default {
  ...obj,
  [ROOT.SET_AUTH]: (state, data) => {
    state.auth = data;
  },
  [ROOT.SESSION_AUTH]: (state, loginResult) => {
    state.auth = loginResult;
  },
  [ROOT.SESSION_OUT]: (state, data) => {
    state.auth = data;
  },
  [ROOT.POPUP_ALERT]: (state, message) => {
    state.popupAlert = {
      isShow: true,
      ...message
    }
  },
  [ROOT.POPUP_CONFIRM]: (state, message) => {
    state.popupConfirm = {
      isShow: true,
      ...message
    }
  }
}
