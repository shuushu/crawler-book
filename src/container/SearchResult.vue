<template>
  <div id="search">

    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else>
      <div v-if="search.length <= 0" class="md-empty-state-wrap">
        <md-empty-state
          class="md-primary"
          md-icon="sentiment_dissatisfied"
          md-label="Nothing in Done"
          md-description="검색 결과 없음">
        </md-empty-state>
      </div>
      <div v-else>
        <div class="total">검색 결과 총 {{search.length}} 건</div>
        <md-list class="md-triple-line md-dense"  v-for="items in search" :key="items.objectID">
          <md-list-item>
            <md-avatar>
              <img :src="items.thumb" alt="People">
            </md-avatar>

            <div class="md-list-item-text">
              <span class="title">{{ toUpperCase(items.cate) }} {{ items.name }}</span>
              <span class="desc">{{ items.desc }}</span>
              <a :href="items.refUrl" class="link" target="_blank">도서 자세히 보기</a>
            </div>
            <div>
            </div>
            <div v-if="isRental(items.state)" >
              {{ getRentUser(items.uid) }} 대여중
            </div>
            <div v-else-if="items.bookpos === null">
              승인 대기중
            </div>
            <md-button v-else @click="rentBook(items)" class="md-accent btn-rent">대여하기</md-button>

          </md-list-item>
          <md-divider class="md-inset"></md-divider>
        </md-list>

      </div>
      <md-snackbar :md-active.sync="complete">대여가 완료 되었습니다!</md-snackbar>
    </div>
  </div>
</template>

<script>
import Book from "../components/Book";
import { mapState } from 'vuex'


export default {
  name: 'searchBook',
  components: { Book },
  data () {
    return {
      complete: false,
      active: false, // 등록완료시 flag
    }
  },
  computed: {
    fetchData() {
      if (this.isFilter) {
        return this.rentable
      } else {
        return this.books
      }
    },
    ...mapState({
      auth: state => state.auth,
      isLoading: state => state.ready,
      count: state => state.bookList.page,
      rental: state => state.bookList.rental,
      users: state => state.bookList.users,
      search: state => state.bookList.search
    })
  },
  methods: {
    isRental(state) {
      return Number(state) === 1
    },
    toUpperCase(data) {
      let category = data.join(", ");

      return `[${category.toUpperCase()}]`
    },
    rentBook(params) {
       this.$run('dialogConfirm', {
        name: `${params.name} 책을 대여 하시겠습니까?`,
        message: `'${params.desc}' 책을 대여 하시겠습니까? <p class=link><a href=${params.refUrl} target=_blank>URL 참조하기</a></p>`,
        key: params.objectID,
        action: this.onConfirm
      })

      this.active = true;
    },
    getRentUser(bookid) {
      let getUID = this.users[bookid];
      return getUID.displayName + '님' || ''
    },
    onConfirm(params) {
      if (!params) {
        return false;
      }

      this.$run('bookList/rentBook', {
        key: params.key,
        uid: this.auth.uid
      }).then(res => {
        this.complete = res;
      });
    },
    onCancel() {}
  }
}
</script>

<style lang="scss" scoped>
  #search{
    .total{
      width: 50%;
      margin: 15px auto;
      text-align: center;
      padding: 5px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      border-radius: 20px;
      background-color: #ff5252;
      box-shadow: 1px 1px 3px #999;
    }
    .wrap-center{
      position: fixed;
      width: 100%;
      display: flex;
      left: 0;
      justify-content: center;
      top: 0;
      align-items: center;
      height: 100%;
      z-index: 100;
    }
    .option{
      margin: 0 10px;
    }
    .md-list {
      max-width: 100%;
      display: inline-block;
      vertical-align: top;
      border: 1px solid rgba(#000, .12);
      border-top: 0;
      .btn-rent{
        min-width: 30px;
      }
    }
    .md-triple-line{
      border-top: 1px solid #ddd;
      margin-top: -1px;
    }
    .md-triple-line .md-inset:last-child{
      display: none;
    }
    .md-list-item-text {
      .title{
        font-size: 15px;
      }
      .desc{
        margin-bottom: 4px;
      }
    }
  }
</style>
