import { TYPE } from '../common/config'
let ROOT = {};

TYPE.forEach(value => {
  ROOT = Object.assign(ROOT, {
    [`${value}_REQ_WAIT`]: `${value}_REQ_WAIT`,
    [`${value}_REQ_SUCCESS`]: `${value}_REQ_SUCCESS`,
    [`${value}_REQ_FAIL`]: `${value}_REQ_FAIL`
  })
});

export default {
  ...ROOT,
  SET_AUTH: 'SET_AUTH',
  SESSION_AUTH: 'SESSION_AUTH',
  SESSION_OUT: 'SESSION_OUT',
  POPUP_ALERT: 'POPUP_ALERT',
  POPUP_CONFIRM: 'POPUP_CONFIRM'
}

export const BOOKLIST = {
  HISTORY: 'bookList/GET_HISTORY',
  RENT: 'bookList/GET_RENT',
  USERS: 'bookList/GET_USERS',
  SET_PAGE: 'bookList/SET_PAGE',
  GET_BOOKLIST: 'bookList/GET_BOOKLIST',
  GET_SEARCH_BOOKLIST: 'bookList/GET_SEARCH_BOOKLIST',
  SET_BOOK_ENABLE: 'bookList/SET_BOOK_ENABLE',
}

export const RENT = {
  GET_RENTLIST: 'rental/GET_RENTLIST'
}
