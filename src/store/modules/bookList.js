import firebase from 'firebase'
import rootMutations from '../mutations'
import { put, call, delay } from "vuex-saga";
import ROOT, { BOOKLIST }  from '../constant'
// webcrawling
import axios from 'axios'
import cheerio from 'cheerio'
// util
import { yyyymm } from "../../common/util";
import { index } from "../../common/config";

// firebase on method variable
let initBookList;

let state = {
  rental: null,
  item: null,
  users: null,
  search: [],
  page: 20,
  modify: null,
  history: null
}

const getters = {
  getNames: state => {
    let temp = [];
    if (state.item) {
      for (let key in state.item) {
        temp.push(state.item[key].name);
      }
    }
    return temp;
  },
  rentable: state => {
    if (state.item) {
      let keys = Object.keys(state.item);
      let filter = keys.reduce((temp, key) => {
        if (state.item[key].state === 2) {
          temp[key] = state.item[key]
        }

        return temp;
      }, {});

      return Object.keys(filter).length > 0  ? filter : false;
    }
  },
  filter: state => (cate, rentabel) => {
    if (state.item) {

      function filterCheck(key) {
        let cateCheck = state.item[key].cate;

        return cate.every(r => {
          return cateCheck.includes(r)
        });
      }

      let keys = Object.keys(state.item);
      let filter = keys.reduce((temp, key) => {

        // 대여가능만 켜진 있는 경우
        if (rentabel) {
          // 체크된 필터는 있나?
          if (cate.length > 0) {
            // 대여가능 체크 와 필터체크 모두 켜진 경우
            if (state.item[key].state === 2 && filterCheck(key)) {
              temp[key] = state.item[key]
            }
          } else {
            if (state.item[key].state === 2) {
              temp[key] = state.item[key]
            }
          }
        } else {
          // 체크된 필터는 있나?
          if (cate.length > 0) {
            if (filterCheck(key)) {
              temp[key] = state.item[key]
            }
          } else {
            temp[key] = state.item[key]
          }
        }

        return temp;
      }, {});

      return Object.keys(filter).length > 0  ? filter : false;
    }
  },
  filterYear: state => (value) => {
    if (value === 'all') {
      return state.history
    } else {
      if (state.history) {
        let keys = Object.keys(state.history), obj = {};

        keys.forEach(item => {
          let year = item.substr(0,4);
          obj[year] = {}
        });

        keys.forEach(i => {
          let year = i.substr(0,4);
          obj[year][i] = state.history[i]
        });

        return obj[value] || null
      }
    }
  }
}

const mutations = {
  GET_BOOKLIST: (state, data) => {
    state.item = data
  },
  SET_PAGE: (state, cnt) => {
    if (cnt !== false) {
      state.page = state.page + cnt
    } else {
      state.page = false;
    }
  },
  GET_RENT: (state, rentData) => {
    state.rental = rentData;
  },
  GET_USERS: (state, userData) => {
    state.users = userData;
  },
  FILTER: (state, data) => {
    state.item = data
  },
  GET_SEARCH_BOOKLIST: (state, searchResult) => {
    state.search = searchResult
  },
  SET_BOOK_ENABLE: (state, selectBookData) => {
    state.modify = selectBookData
  },
  GET_HISTORY: (state, historyData) => {
    state.history = historyData
  }
}


const querySelectAll = (store, PATH) => {
  let DB;

  if (PATH.hasOwnProperty('option')) {
    if(PATH.option = 'limitToLast') {
      DB = firebase.database().ref(`books/${PATH.key.toLocaleLowerCase()}`).limitToLast(state.page)
    }
  } else {
    DB = firebase.database().ref(`books/${PATH.key.toLocaleLowerCase()}`)
  }

  return new Promise(resolve => {
    DB.on('value', data =>  {
      if (data.val()) {
        // callback이 있을때
        if (PATH.fn) {
          PATH.fn(data)
        }
        store.commit(BOOKLIST[PATH.key], data.val())
        store.commit(ROOT[`${PATH.key}_REQ_SUCCESS`])
      } else {
        store.commit(ROOT[`${PATH.key}_REQ_FAIL`])
      }
      resolve(data.val())
    })
  });
}
const getBookList = (store) => {
  if (initBookList) {
    // 이전에 연결된 이벤트 해제 후 다시 연결함
    initBookList.off('value')
  }

  return new Promise(resolve => {
    initBookList = firebase.database().ref('books/list');

    initBookList.limitToLast(state.page).on('value', snap => {
      if (snap.val()) {
        store.commit(BOOKLIST.GET_BOOKLIST, snap.val())
        store.commit(ROOT.GET_BOOKLIST_REQ_SUCCESS)
        resolve(snap.val())
      } else {
        store.commit(ROOT.GET_BOOKLIST_REQ_FAIL)
        resolve(false)
      }
    })
  })
}



const actions = {
  *rentBook({}, params) {
    yield put(ROOT.JOIN_RENT_REQ_WAIT)
    // 동시 대여 체크
    let check = yield call(() => {
      return new Promise(resolve => {
        firebase.database().ref(`books/list/${params.key}`).once('value').then(resultRentState => {

          // 상태[ 0:비승인 1:대여중 2: 대여가능 ]
          if (resultRentState.val().state === 2) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    });

    if (check) {
      let updata = yield call(() => {
        return new Promise(resolve => {
          let updates = {}

          updates[`books/rent/${params.key}`] = params.uid;

          firebase.database().ref().update(updates).then((error) => {
            if (error) {
              console.log('Error has occured during saving process')
              this.commit(ROOT.JOIN_RENT_REQ_FAIL)
              resolve(false);
            } else {
              // success
              firebase.database().ref(`books/list/${params.key}/cnt`).set(state.item[params.key].cnt + 1);
              firebase.database().ref(`books/list/${params.key}/state`).set(1);
              // searchDB
              index.partialUpdateObjects([{
                cnt: state.item[params.key].cnt + 1,
                state: 1,
                objectID: params.key
              }], err => {
                if (err) throw err;

                this.commit(ROOT.JOIN_RENT_REQ_SUCCESS)
                resolve(true);
              });

            }
          });
        })
      });

      return updata
    } else {
      alert('이미 대여중인 도서입니다.')
      this.commit(ROOT.JOIN_RENT_REQ_FAIL)

      return false;
    }
  },
  *search({}, params) {
    index.setSettings({
      searchableAttributes: ['name', 'desc', 'cate']
    });
    let queryData = {};

    yield put(ROOT.SEARCH_BOOKLIST_REQ_WAIT)

    if (params) {
      queryData.query = params.trim()
    } else {
      queryData.query = '';
    }

    index.search(queryData, (err, content) => {
      if (err) {
        this.commit(ROOT.SEARCH_BOOKLIST_REQ_FAIL)
        console.log(err)
      } else {
        index.clearCache();
        this.commit(BOOKLIST.GET_SEARCH_BOOKLIST, content.hits)
        this.commit(ROOT.SEARCH_BOOKLIST_REQ_SUCCESS)
      }
    })
  },
  *init() {
    if (!state.rental || !state.item || !state.users) {
      yield put(ROOT.INIT_REQ_WAIT)
    }

    // 렌트정보
    if (state.rental === null) yield call(querySelectAll, this, { key: 'RENT' })

    // 사용자 정보
    if (state.users === null) yield call(querySelectAll, this, { key: 'USERS' })

    // 북정보
    if (state.item === null) yield call(getBookList, this)
  },
  *setPage({}, cnt) {
    yield put(BOOKLIST.SET_PAGE, cnt);
    // 북정보
    yield call(getBookList, this)

    if (state.page > Object.keys(state.item).length) {
      yield put(BOOKLIST.SET_PAGE, false);
      yield put(ROOT.POPUP_ALERT, {
        message: '데이터 로드 완료, 더이상 데이터가 없습니다'
      });
    }
  },
  *write(store, params) {
    yield put(ROOT.ADD_BOOKLIST_REQ_WAIT)

    let result = yield call(() => {
      return new Promise(resolve => {
        let updates = Object.assign(params);
        //delete updates.uid;

        firebase.database().ref(`books/list/${params.objectID}`).update(updates).then(error => {
          if (error) {
            console.log('Error has occured during saving process')
            resolve(false);
          } else {
            // success
            // Add or update new objects
            index.saveObjects([{...params}]).then(() => {
              console.log('Contacts imported into Algolia');
              this.commit(ROOT.ADD_BOOKLIST_REQ_SUCCESS)
              resolve(true);
            }).catch(error => {
              console.error('Error when importing contact into Algolia', error);
              process.exit(1);
              this.commit(ROOT.ADD_BOOKLIST_REQ_FAIL)
              resolve(false);
            });
          }
        });
      })
    })

    return result;
  },
  *modify({}, params) {
    this.commit(BOOKLIST.SET_BOOK_ENABLE, params)
  },
  *getHistory({}, params) {
    if (!state.history) {
      yield put(ROOT.HISTORY_REQ_WAIT)
    }

    // 사용자 정보
    if (state.users === null) yield call(querySelectAll, this, {
      key: 'USERS'
    })

    if (state.history === null) yield call(querySelectAll, this, {
      key: 'HISTORY',
    })
  },
  *setHistory(store, params) {
    let { name, desc, refUrl, uid, thumb, objectID, price, old } = params;
    let current = old ? 'old' : yyyymm(new Date());
    firebase.database().ref('books/history').child(current).child(objectID).update({ name, desc, refUrl, uid, thumb, price })
  },
  *reqBook(store, params) {
    yield put(ROOT.BUY_BOOK_REQ_WAIT);

    // 신청목록에 있는지?
    let isHistory = yield call(() => {
      return new Promise(resolve => {
        firebase.database().ref('books/list').orderByChild('bookID').equalTo(params.refUrl).once('value').then(snap => {
          if (snap.val()) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      });
    });

    if (isHistory) {
      let crawling = yield call(() => {
        return new Promise(resolve => {
          const objectID = params.refUrl;

          axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://www.aladin.co.kr/m/mproduct.aspx?ItemId=${objectID}`).then(response => {

            if (response.status === 200) {
              let html = response.data,
                $ = cheerio.load(html),
                thumb = $('#CoverMainImage').attr('src') || $('.prodImage_size img').attr('src'),
                name = $('.pdp_header_info .pdp_black').text(),
                desc = $('.pdp_header_info .pdp_fwn').text() || '-',
                detail = $('meta[property="og:description"]').attr('content'),
                price = '' + $('meta[property="og:price"]').attr('content'),
                refUrl = `https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=${objectID}`;

              thumb = `${thumb}`;

              detail = detail.trim();
              detail = detail.substr(0, 142) + '...';
              //price = price.split(',');
              //price = price.join('');

              if (thumb !== '' && name !== '') {
                resolve({ desc, name, thumb, refUrl, objectID, detail, price })
              } else {
                resolve(false)
              }
            }
          }).catch(function (error) {
            console.log(error);
          });
        })
      })

      if (crawling) {
        yield put(ROOT.BUY_BOOK_REQ_SUCCESS)
        return Object.assign(params, crawling, { cnt:0, state:0 })
      } else {
        yield put(ROOT.POPUP_ALERT, {
          message: '크롤링 오류, bookID 확인 해주세요'
        });
        yield put(ROOT.BUY_BOOK_REQ_FAIL);
      }
    } else {
      yield put(ROOT.POPUP_ALERT, {
        message: '이전에 신청한 도서입니다.'
      });
      yield put(ROOT.BUY_BOOK_REQ_FAIL);
    }



  },
  // 신청한 도서 승인처리
  *admission({}, params) {
    yield put(ROOT.ADMISSION_REQ_WAIT)

    let result = yield call(() => {
      return new Promise(resolve => {
        firebase.database().ref(`books/list/${params.objectID}`).update(params).then(error => {
          if (error) {
            console.log('Error has occured during saving process')
            resolve(false);
          } else {
            // searchDB
            index.partialUpdateObjects([params], err => {
              if (err) {
                this.commit(ROOT.ADMISSION_REQ_FAIL)
                resolve(false);
              } else {
                this.commit(ROOT.ADMISSION_REQ_SUCCESS)
                resolve(true);
              }
            });
          }
        })
      })
    })

    return result
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
