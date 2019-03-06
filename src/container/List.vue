<template>
  <div id="bookList">
    <div class="option">
      <md-switch class="custom-label" v-model="isFilter">대여 가능한 도서만 보기</md-switch>
      <md-button v-if="count" @click="itemMore" class="md-primary md-raised">10개 더보기</md-button>
    </div>

    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div v-else>
      <md-field class="filter">
        <label for="filter">분류해서 보기</label>
        <md-select v-model="filterTemp" name="filter" id="filter" multiple>
          <md-option value="tech">기술</md-option>
          <md-option value="uiux">UI/UX</md-option>
          <md-option value="trend">시장동향</md-option>
          <md-option value="etc">기타</md-option>
        </md-select>
      </md-field>

      <div v-if="fetchData === false" class="md-empty-state-wrap">
        <md-empty-state
          class="md-primary"
          md-icon="sentiment_dissatisfied"
          md-label="Nothing in Done"
          md-description="대여가능한 도서 없음">
        </md-empty-state>
      </div>
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
                <div v-else-if="list.state === 0">
                  <md-button v-if="adminCheck()" @click="modify(key)" class="md-raised md-accent">승인하기</md-button>
                  <md-button v-else class="md-raised" disabled>승인중</md-button>
                </div>
                <md-button v-else class="btnRent md-primary md-raised">
                  <span @click="viewPosition(list.bookpos)">{{ list.bookpos }}</span>
                  <span @click="rentBook(list, key)">대여하기</span>
                </md-button>

              </div>
          </div>

        </div>



        <md-dialog id="book-table"  :class="classActive" :md-active.sync="showDialog">
          <h3><md-icon>local_offer</md-icon> 책장 위치</h3>
          <div class="table-wrap">
            <table>
              <tbody>
                <tr v-for="idx in 5" :key="`Aitem-${idx}`">
                  <td :class="`A${ calculator(idx,1)}`">A{{ calculator(idx,1) }}</td>
                  <td :class="`A${ calculator(idx,2)}`">A{{ calculator(idx,2) }}</td>
                  <td :class="`A${ calculator(idx,3)}`">A{{ calculator(idx,3) }}</td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
              <tr v-for="idx in 5" :key="`Bitem-${idx}`">
                <td :class="`B${ calculator(idx,1)}`">B{{ calculator(idx,1) }}</td>
                <td :class="`B${ calculator(idx,2)}`">B{{ calculator(idx,2) }}</td>
                <td :class="`B${ calculator(idx,3)}`">B{{ calculator(idx,3) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </md-dialog>




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
      classActive: null,
      showDialog: false,
      filterTemp: [],
      isFilter: false, // 대여 가능한 도서만 보기
      complete: false,
      active: false, // 등록완료시 flag
    }
  },
  computed: {
    fetchData() {
      return this.filter(this.filterTemp, this.isFilter)
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
      filter: 'bookList/filter'
    })
  },
  created() {
    this.$run('bookList/init')
  },
  methods: {
    viewPosition(params) {
      this.classActive = params;
      this.showDialog = !this.showDialog
    },
    calculator(idx, i) {
      return (idx-1) * 3 + i
    },
    rentBook(data, dbKey) {
      this.$run('dialogConfirm', {
        name: data.name,
        message: `'${data.desc}' 책을 대여 하시겠습니까? <p class=link><a href=${data.refUrl} target=_blank>URL 참조하기</a></p>`,
        action: this.rentAction,
        key: dbKey
      });
    },
    rentAction(params) {
      this.$run('bookList/rentBook', {
        key: params.key,
        uid: this.auth.uid,
      }).then(res => {
        this.complete = res;
      });
    },
    onCancel() {
    },
    itemMore() {
      this.$run('bookList/setPage', 10);
      this.isFilter = false
    },
    adminCheck() {
      if (this.auth) {
        return admin === this.auth.email
      } else {
        return false;
      }
    },
    modify(key) {
      this.$router.push('/write');
      let temp = Object.assign(this.fetchData[key], {objectID: key})
      this.$run('bookList/modify', temp);
    }
  }
}
</script>

<style lang="scss">
  #book-table{
    //height: 82vw;
    width: 90%;
    height: 45%;
    max-width: 600px;
    padding-bottom: 20px;
    $i: 20;
    @while $i > 0 {
      &.A#{$i} .A#{$i}{background-color: #deea66;}
      $i: $i - 1;
    }
    .table-wrap{
      overflow: hidden;
      padding: 0 20px;
    }
    h3{
      font-size: 20px;
      margin-left: 20px;
      .md-icon{color: #000;}
    }
    table{
      float: left;
      width: 50%;
      margin: 0 auto;
      border-collapse: separate;
      //background-color: #ccc;
      border-spacing: 4px;
      background: -moz-linear-gradient(top, #a78953 0%, #884d11 44%, #633505 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, #a78953 0%,#884d11 44%,#633505 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, #a78953 0%, #884d11 44%, #633505 100%);
      td{
        font-size: 16px;
        font-weight: bold;
        background-color: #fff;
        text-align: center;
        vertical-align: middle;
        height: 50px;
        width: 50px;
      }
    }
  }
  #bookList{
    .filter{
      width: 90%;
      margin: 10px 0 40px 5%;
    }
    #filter{
      font-size: 12px;
    }

    .md-layout{
      flex-wrap: wrap-reverse;
      flex-direction: row-reverse;
    }
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
      position: relative;
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
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

  @media screen and (min-width: 1200px) {
    .md-layout-item {
      flex: 400px
    }
  }
</style>
