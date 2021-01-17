<template>
    <md-toolbar class="md-primary">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button @click="historyBack" class="md-icon-button">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </div>


        <div class="md-toolbar-section-start">

          <md-autocomplete
            class="search"
            v-model="selectedEmployee"
            :md-options="bookNames"
            md-layout="box">
            <label>Search...</label>
          </md-autocomplete>
          <md-button class="md-icon-button" @click="search">
            <md-icon>refresh</md-icon>
          </md-button>
        </div>
        <div class="md-toolbar-section-end">

          <md-button class="md-icon-button" @click="logout">
            <md-icon>highlight_off</md-icon>
          </md-button>
        </div>
      </div>
    </md-toolbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Header',
    data: () => ({
      selectedEmployee: ' '
    }),
    methods: {
      historyBack(){
        this.$router.go(-1)
      },
      search() {
        if (this.selectedEmployee.length === 1) {
          this.$run('dialogAlert', {
            message: '검색어가 너무 짧습니다'
          })
        } else {
          this.$router.push(`/search/${this.selectedEmployee}`)
          this.$run('bookList/search', this.selectedEmployee)
        }
      },
      logout() {
        this.$run('dialogConfirm', {
          name: '로그아웃',
          message: '로그아웃 하시겠습니까?',
          action: this.actionLogout
        } );
      },
      actionLogout() {
        this.$run('logout').then(res => {
          this.$run('dialogAlert', {
            message: res ? '로그아웃 되었습니다' : res.code
          })
        })
      }
    },
    computed: {
      ...mapGetters({
        bookNames: 'bookList/getNames'
      })
    }
  }
</script>

<style lang="scss">
  .md-toolbar{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  .search {
    max-width: 500px;

  }
  .md-autocomplete-box-content{
    background-color: white;
  }
</style>
