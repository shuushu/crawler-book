import algoliasearch from "algoliasearch";

export const fbConfig = {
  apiKey: "AIzaSyBwc5tkZM3fEQcyPC1-HfguTbIt8woO9iA",
  authDomain: "shushu-cb26c.firebaseapp.com",
  databaseURL: "https://shushu-cb26c.firebaseio.com",
  storageBucket: "shushu-cb26c.appspot.com"
};

const algolia = algoliasearch(
  'DRSKU1E4I6',
  '00fa756e3e424016ca0d3ed071850f77'
);


export const index = algolia.initIndex('books');

// 상태값
export const TYPE = [
  'INIT',
  'SET_PAGE', // 페이징 카운트
  'RENT', // 공통함수로 호출하여 네이밍룰 따름 > 모든 빌린도서 > get
  'USERS', // 공통함수로 호출하여 네이밍룰 따름 > 모든 유저 > get
  'HISTORY', // 도서 요청 내역 > 공통함수로 호출하여 네이밍룰 따름 > get
  'REMOVE_RENT', // 도서반납 > 스토어 없음, DB에서 소켓통신중,
  'GET_BOOKLIST', // 도서 내역
  'GET_RENTLIST', // 내가 빌린도서 get
  'JOIN_RENT', //  도서대여 > 스토어 없음, 상태만 존재, DB에서 소켓통신중
  'SEARCH_BOOKLIST',
  'ADMISSION',
  'ADD_BOOKLIST',
  'BUY_BOOK',
  'LOGIN_EMAIL',
  'LOGIN_GOOGLE_AUTH',
  'CREATE_AUTH'
];
