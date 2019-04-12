# book
vue, firebase를 이용해 간단한 도서 웹앱 만들기
[DEMO](http://gnscjfdl.cafe24.com/app)


## Features
- vue, vuex, vue-router, vuex-saga, node-sass
- [**firebase**](#documentation): 데이터 저장, Auth 및 socket.io 통신
- [**vue**](https://vuematerial.io/getting-started/): 프로토타입 UI
- [**lgoliasearch**](https://www.algolia.com/) 도서 검색
- 웹크롤링: cheerio, cors 우회 도메인


## Getting started
```
npm install

npm run serve

npm run build

```

## document
도서 현황 및 신청프로세스의 어려움에 있어 개선의 필요성을 느껴 시작




## 기능
- 도서 대여
- 도서 검색
- 카테고리 별 도서 정렬
- 년도별 도서 신청 내역 확인
- 남은 예산 확인
- 신청 품의서 템플릿 제공








## flow
- asis
1) 신청자가 wiki에 도서 신청 목록 및  도서 url를 입력

2) 관리자가 url로 도서 이름 및 비용 리스트업

3) 품의서 등록

> 해당 도서를 다시 DB에 등록 (현재 존재 하지 않음)



- tobe
1) 도서 신청을 직접 (bookid, 이름, 카테고리)

2) 책정보를 크롤링하여 도서 DB등록, 도서는 신청중으로 상태 변경
 > 신청자가 누구인지, 한해 남은 예산이 계산 및 신청 양식이 그려짐

3) 품의서 등록

4) 관리자가 승인 (해당 책위치 표식)



![Alt text](http://gnscjfdl.cafe24.com/chat/flow.jpg)
