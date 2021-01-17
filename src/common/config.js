import algoliasearch from "algoliasearch";

export const fbConfig = {
  apiKey: "AIzaSyCh-Yb5QRWYNPtypC7ZR68JmxcDCld6f3w",
  authDomain: "books-38df3.firebaseapp.com",
  databaseURL: "https://books-38df3.firebaseio.com",
  storageBucket: "books-38df3.appspot.com"
};

const algolia = algoliasearch(
  'IR4NMVE7DJ',
  '55d298ae2187ff5f27bebdf3db895a85'
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
