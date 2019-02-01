import { curry } from '../common/util'

export default {
  REQ_WAIT: 'REQ_WAIT'
}
export const COUPON = {
  GET_BOOK_LIST: 'getBookList',
}

const curried = curry((moduleName, uri) => `${moduleName}/${uri}`)
export const couponURI = curried('coupon')
