<template>
  <div id="history">
    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else>
      <div class="option">
        <md-field class="filter">
          <label for="filter">년도별 신청 내역 보기</label>
          <md-select v-model="filterTemp" name="filter" id="filter">
            <md-option value="all">전체보기</md-option>
            <md-option :value="i" v-for="i in rangeYear" :key="`year${i}`">{{i}}</md-option>
          </md-select>
        </md-field>
      </div>


      <div v-if="fetchData === null" class="md-empty-state-wrap">
        <md-empty-state
          class="md-primary"
          md-icon="sentiment_dissatisfied"
          md-label="Nothing in Done"
          md-description="신청한 도서 목록 없음">
        </md-empty-state>
      </div>
      <div class="item-wrap" v-else v-for="(items, key) in fetchData" :key="key">
        <h3 class="date"><md-icon>local_offer</md-icon>{{ key }}월 도서 신청 내역</h3>
        <div class="total">
          남은 예산: {{ getCash(items, key) }}
          <md-button class="md-icon-button md-list-action" @click="getTemplate(items)">
            <md-icon class="md-primary">get_app</md-icon>
          </md-button>
        </div>
        <md-table>
          <md-table-row>
            <md-table-head class="cell1 th1" md-numeric>도서명</md-table-head>
            <md-table-head class="cell2 th2">신청자</md-table-head>
            <md-table-head class="cell3 th3">가격</md-table-head>
          </md-table-row>

          <md-table-row v-for="(data, uniq) in items" :key="uniq">
            <md-table-cell class="thumbs cell1">
              <md-avatar><img :src="data.thumb" alt="People"></md-avatar>
              <div class="name">{{ data.name }}</div>
              <div class="desc">{{ data.desc }}</div>
            </md-table-cell>
            <md-table-cell class="cell2">{{ users[data.uid].displayName }}</md-table-cell>
            <md-table-cell class="cell3">{{ data.price }}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  let cash, YEAR;

  export default {
    name: 'History',
    data () {
      return {
        filterTemp: this.getYear()
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.ready,
        users: state => state.bookList.users,
        history: state => state.bookList.history
      }),
      ...mapGetters({
        filter: 'bookList/filterYear'
      }),
      rangeYear() {
        let y = this.getYear(), temp = [];

        for (let i=0;i < 3;i++) {
          temp.push(y-i)
        }
        return temp;
      },
      fetchData() {
        // data reload
        if (cash) {
          cash = 1000000
        }

        return this.filter(this.filterTemp)
      }
    },
    created () {
      this.$run('bookList/getHistory')
    },
    methods: {
      getTemplate(list) {
        let size = Object.keys(list).length, template2 = '책목록<br>', cnt = 0;

        for(let item in list) {
          let { name, price, refUrl} = list[item];

          let nPrice = price.split(',');
              nPrice = nPrice.join('');

          cnt = cnt + Number(nPrice);

          template2 += `<div><a href="`+ refUrl +`" target="_blank">` + name + `</a> /  `+ price +`</div>`
        }

        let template1 = `
          예산 품의서 신청 양식(경비성) <br/><br/>

          1. 구매목적: UI개발팀 역량강화  <br/>
          2. 도서목록: 총 ` + size +`권 (하단 제목 나열)  <br/>
          3. 구입처: 알라딘 (aladdin.co.kr)  <br/>
          4. 총 금액 및 결제수단 : 총 `+cnt+`원 (법인카드 사용)  <br/>
          5. 예산계정 : 도서비  <br/>
          6. 예산내역 : 2019년 경영계획상 책정된 UI개발팀 도서비 (연간 100만원) 예산에서 사용  <br/><br/><br/>
        `;


        this.$run('dialogAlert', {
          message: template1 + template2,
        });
      },
      getYear() {
        let currentDate = new Date();
        return currentDate.getFullYear();
      },
      getCash(item, month) {
        if(YEAR !== month.substr(0,4)) {
          cash = 1000000 // 도서 년간 예산
        }

        YEAR = month.substr(0,4);

        for(let i in item) {
          let m = item[i].price;
              m = m.split(',');
              m = m.join('');
          cash = cash - Number(m)
        }
        return cash
      }
    }
  }
</script>

<style lang="scss">
#history{
  .option{
    width: 95%;
    margin: 20px auto 0;
    box-sizing: border-box;
    .md-field{
      margin-bottom: 0;
    }
  }
  .date{
    margin-left: 10px;
    .md-icon{ margin-right: 10px; color: #000; }
  }
  td, th{ text-align: left; }
  .item-wrap{
    position: relative;
    padding-top: 10px;
  }
  .md-table-content{
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .total{
    position: absolute;
    right: 10px;
    top: 45px;
    font-size: 12px;
    padding-right: 30px;
    .md-list-action{
      position: absolute;
      right: -15px;
      top: -10px;
    }
  }
  .th1{
    padding-left: 20px;
  }
  .cell1 .md-table-cell-container{
    padding-left: 20px;
  }
  .cell2{
    width: 60px;
    text-align: center;
  }
  .cell3{
    width: 60px;
    text-align: center;
  }
  .thumbs{
    padding-left: 40px;
    position: relative;
    .md-avatar{
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -20px;
      border: 1px solid #efefef;
    }
    .name{font-size: 14px;font-weight: bold;margin: 5px 0 3px;}
    .desc{font-size: 12px;color: #999;margin-bottom: 5px;}
  }
  .md-table-head-container {
    height: 46px;
    padding: 10px 0;
  }
  .md-table-cell-container{
    padding: 6px 0 6px 0;
  }
  .md-table-head-label{
    font-size: 14px;
    color: black;
    font-weight: bold;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
