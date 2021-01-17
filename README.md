# book
> 알라딘 사이트에서 url 입력하면 책정보 리소스를 크롤링하여 DB에 등록한다.

```
- client: vue, vuex, vuex-saga, vuematerial.io, vue-router
- DB: firebase Database
- 검색DB: algoliasearch

- 웹크롤링: cheerio, cors 우회 도메인
```

## firebase 트리구조
```
books
  > history (도서 신청 내역)
  > list (도서 등록 내역)
  > user (멤버)
```

## src 구조
```
common (환경설정, 유틸리티, 라우터)
components (공통 컴포넌트)
container (페이지)
store (스토어, mutation, action등)

```


> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
