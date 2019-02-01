<template>
  <div id="bookList">
    <div class="option">
      <md-checkbox class="custom-label" v-model="isFilter">대여 가능한 도서만 보기</md-checkbox>
      <md-button v-if="count" @click="itemMore" class="md-primary md-raised">10개 더보기</md-button>
    </div>

    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else>
      <div v-if="fetchData === false">대여가능한 도서 없음</div>
      <div v-else >
        <div class="md-layout md-gutter md-alignment-center">
          <div v-for="(list, key) in fetchData"  :key="key"  class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <Book :data="list" />
              <div class="rental-btnwrap">
                <div v-if="list.state === 1 && users[rental[key]]" class="name-label">
                  <md-avatar>
                    <img :src="users[rental[key]].photoURL" alt="Avatar">
                  </md-avatar>
                  <span class="info">
                    <span class="wrap">
                      {{ users[rental[key]].displayName }}
                      <em>{{ users[rental[key]].email }}</em> 님이
                    </span>
                    <span class="cell">현재 대여중 입니다.</span>
                  </span>
                </div>
                <md-button v-else @click="rentBook(list, key)" class="btnRent md-primary md-raised">대여하기</md-button>
              </div>
          </div>

        </div>



        <md-dialog-confirm
          :md-active.sync="active"
          :md-title="dialog.name"
          :md-content="dialog.context"
          :md-confirm-text="dialog.confirm"
          :md-cancel-text="dialog.cancel"
          @md-cancel="onCancel"
          @md-confirm="onConfirm(dialog)"
        />
      </div>
      <md-snackbar :md-active.sync="complete">대여가 완료 되었습니다!</md-snackbar>
    </div>
  </div>
</template>

<script>
import Book from "../components/Book";
import { mapState, mapGetters } from 'vuex'


export default {
  name: 'list',
  components: { Book },
  data () {
    return {
      isFilter: false, // 대여 가능한 도서만 보기
      complete: false,
      active: false, // 등록완료시 flag
      dialog: {}, // handle 클릭 도서 임시객체
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
      books: state => state.bookList.item
    }),
    ...mapGetters({
      rentable: 'bookList/rentable'
    })
  },
  created() {
    this.$run('bookList/init')
  },
  methods: {
    rentBook(data, dbKey) {
      // 선택한 데이터 overwrite
      this.dialog = {
        ...data,
        key: dbKey,
        context: `'${data.desc}' 책을 대여 하시겠습니까? <p class=link><a href=${data.refUrl} target=_blank>URL 참조하기</a></p>`,
        confirm: 'Yes',
        cancel: 'No'
      };

      this.active = true;
    },
    onConfirm(params) {
      if (!params) {
        return false;
      }

      this.$run('bookList/rentBook', {
        key: this.dialog.key,
        uid: this.auth.uid
      }).then(res => {
        this.complete = res;
      });
    },
    onCancel() {
    },
    itemMore() {
      this.$run('bookList/setPage', 3);
      this.isFilter = false
    }
  }
}
</script>

<style lang="scss" scoped>
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
  #bookList{
    .rental-btnwrap{
      margin: 0;
      padding: 0;
      position: absolute;
      left: 0;
      width: 100%;
      white-space: nowrap;
      text-align: center;
      bottom: -140px;
      .name-label{
        display: flex;
        justify-content: center;
        width: 234px;
        margin: 0 auto;
      }
      .md-avatar{
        flex: 0;
        margin-right: 10px;
      }

      .info{
        flex: 1;
        text-align: left;
      }
      .wrap{
        display: block;
        em{
          font-size: 11px;
        }
      }
    }
    .option {
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      .custom-label{
        font-size: 13px;
        text-indent: -10px;
      }
    }
    .md-layout-item {
      margin-bottom: 180px;
      margin-top: 8px;
      position: relative;
      transition: .3s all;

      &:after {
        width: 100%;
        height: 100%;
        display: block;
        background: md-get-palette-color(purple, 200);
        content: " ";
      }
    }
  }
</style>
