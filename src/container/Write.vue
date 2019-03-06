<template>
  <div id="write">
    <div v-if="isLoading" class="wrap-center">
      <md-progress-spinner :md-diameter="50" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <form novalidate class="md-layout">
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <md-field :class="getValidationClass('cate')">
            <label for="movies">category</label>
            <md-select v-model="form.cate" name="movies" id="movies" multiple :disabled="isLoading">
              <md-option value="tech">기술</md-option>
              <md-option value="uiux">UI/UX</md-option>
              <md-option value="trend">시장동향</md-option>
              <md-option value="etc">기타</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.cate.required">카테고리 범주를 선택하세요</span>
          </md-field>
        </div>
      </div>


      <md-field md-inline :class="getValidationClass('refUrl')">
        <label for="refUrl">bookID</label>
        <md-input name="refUrl" id="refUrl" v-model="form.refUrl"  class="url" :disabled="isLoading" />
        <span class="md-error" v-if="!$v.form.refUrl.required">https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=값, 값을 넣어주세요.</span>
      </md-field>


      <div v-if="fetchModify" class="hidden-option">
        <md-field :class="getValidationClass('bookpos')">
          <label for="bookpos">도서위치</label>
          <md-select v-model="form.bookpos" name="bookpos" id="bookpos" :disabled="isLoading">
            <md-option v-for="i in 16" :key="`A${i}`" :value="`A${i}`">A{{i}}</md-option>
            <md-option v-for="i in 16" :key="`B${i}`" :value="`B${i}`">B{{i}}</md-option>
          </md-select>
          <span class="md-error" v-if="!$v.form.bookpos.required">도서위치를 선택하세요</span>
        </md-field>
      </div>
    </form>


    <div>
      <md-field v-if="form.name">
        <label for="title">도서명</label>
        <md-input name="title" id="title" autocomplete="given-name" v-model="form.name"/>
      </md-field>


      <md-field v-if="form.desc">
        <label for="desc">세부정보</label>
        <md-input name="desc" id="desc" v-model="form.desc"/>
      </md-field>

      <div class="thumbnail" v-if="form.thumb">
        <img :src="form.thumb" alt="">
      </div>
    </div>

    <md-card-actions>
      <div v-if="modify" class="modify-btn">
        <md-button class="btn md-raised md-accent" @click.prevent="handleModify" :disabled="isLoading">modify</md-button>
        <md-button class="btn md-raised" @click.prevent="reset" :disabled="isLoading">reset</md-button>
      </div>
      <md-button v-else class="btn md-raised md-accent" @click.prevent="validateUser" :disabled="isLoading">write</md-button>
    </md-card-actions>

    <md-progress-bar md-mode="indeterminate" v-if="isLoading" />
    <md-snackbar :md-active.sync="userSaved">데이터를 가져오는 중입니다. 잠시 기다려주세요!</md-snackbar>
  </div>
</template>

<script>
  import { urlExp } from '../common/util';
  import { validationMixin } from 'vuelidate'
  import { mapState } from 'vuex'
  import {
    name,
    required
  } from 'vuelidate/lib/validators'

  // crowl

  export default {
    name: 'Write',
    mixins: [validationMixin],
    data: () => ({
      disabledDates: date => {
        const day = date.getDay()

        return day === 6 || day === 0
      },
      form: {
        bookpos: null,
        state: 0,
        refUrl: null,
        cate: [],
        thumb: null,
        desc: null,
        name: null


      },
      userSaved: false,
    }),
    validations() {
      let obj = {
        form: {
          cate: { required },
          refUrl: { required }
        }
      };

      if (this.modify) {
        obj.form['bookpos'] = { required }

        return obj
      } else {
        return obj
      }
    },
    computed: {
      ...mapState({
        auth: state => state.auth,
        isLoading: state => state.ready,
        modify: state => state.bookList.modify,
      }),
      fetchModify() {
        if (this.modify) {
          for (let key in this.form) {
            this.form[key] = this.modify[key]
          }
        }
        return this.modify
      },
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()

        for(let key in this.form) {
          this.form[key] = Array.isArray(this.form[key]) ? [] : null
        }
      },
      handleModify () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          let update = Object.assign(this.modify, {
            bookpos: this.form.bookpos
          });
          update.state = 2;

          this.$run('bookList/admission', update).then(res => {
            if(res) {
              // success
              this.$run('dialogAlert', {
                message: '도서 승인 완료'
              })

              this.$run('bookList/modify', null);

              this.clearForm()
            }
          })
        }
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          let bookID = this.form.refUrl;
          this.userSaved = true;
          this.$run('bookList/reqBook', this.form).then(res => {
            /* res params
                책장 pos > null
                카테고리 cate
                설명 desc
                책제목 name
                썸네일 thumb
                링크 refUrl
                PK objectID
                책설명 detail
                가격 price
            */
            if (res) {
              let merge = Object.assign(res, {
                uid: this.auth.uid
              })
              this.$run('bookList/setHistory', merge);
              this.$run('bookList/write', res).then(() => {
                this.$run('dialogAlert', { message: '도서 신청 완료' })
                this.clearForm()
              });
            }
          })
        }
      },
      reset () {
        this.$run('bookList/modify', null);
        this.clearForm();
      }
      // mehodend
    }
  }
</script>

<style lang="scss" scoped>
  #write{
    box-sizing: border-box;
    padding: 10px 20px;
    .thumbnail{
      margin: 10px auto;
      padding: 10px;
      max-width: 320px;
      border: 1px solid #999;
      background-color: #ddd;
      img{
        max-width: 100%;
        display: block;
      }

    }
    .btn{
      margin: 0;
      width: 100%;
    }
    .url{
      font-size: 11px;
    }
    .md-card-actions{
      padding: 0;
      margin: 20px 0 30px;
      width: 100%;
    }
    .hidden-option{
      width: 100%;
    }
    .modify-btn{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .md-button{
         width: 49%;
       }
    }
  }
  .md-progress-bar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .thumbnail{
    width: 100%;
    margin-bottom: 30px;
    font-size: 13px;
  }
  .date{
    padding: 0;
    margin: 0;
    min-height: inherit;
    &:after,
    &::before{
      display: none;
    }
    .md-error{
      bottom: 0;}
  }
</style>
