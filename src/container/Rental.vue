<template>
  <div id="rental">
    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div v-else>
      <div v-if="myRental === false" class="md-empty-state-wrap">
        <md-empty-state
          class="md-primary"
          md-icon="sentiment_dissatisfied"
          md-label="Nothing in Done"
          md-description="대여한 도서 없음">
        </md-empty-state>
      </div>
      <md-list v-else class="md-triple-line md-dense"  v-for="(items, key) in myRental" :key="key">
        <md-list-item>
          <md-avatar>
            <img :src="items.thumb" alt="People">
          </md-avatar>

          <div class="md-list-item-text">
            <span class="title">{{ toUpperCase(items.cate) }} {{ items.name }}</span>
            <span class="desc">{{ items.desc }}</span>
            <a :href="items.refUrl" class="link" target="_blank">도서 자세히 보기</a>
          </div>

          <md-button class="md-icon-button md-list-action" @click="handleClick({ name: items.name, key: key })">
            <md-icon class="md-primary">cached</md-icon>
          </md-button>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </div>

    <md-snackbar :md-active.sync="complete">반납이 완료 되었습니다!</md-snackbar>

  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Rental',
    data () {
      return {
        isReturn: {
          flag: false,
          key: null,
          context: null
        },
        complete: false,
      }
    },
    computed: {
      ...mapState({
        myRental: state => state.rental.item,
        isLoading: state => state.ready,
      }),
    },
    created () {
      this.$run('getSession').then(res => {
        this.$run('rental/getRentList', res.uid)
      })
    },

    methods: {
      toUpperCase(data) {
        let category = data.join(", ");

        return `[${category.toUpperCase()}]`
      },
      handleClick (params) {
        this.$run('dialogConfirm', {
          name: '책을 반납 하시겠습니까?',
          message: `<strong>${params.name}</strong> 대여한 책을 반납하시겠습니까?`,
          key: params.key,
          action: this.confirm
        })
      },
      confirm(data) {
        this.$run('rental/removeItem', data.key)
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
  .option{
    margin: 0 10px;
  }
  .md-list {
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
    border-top: 0;
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
</style>
