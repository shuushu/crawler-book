<template>
  <div id="write">

    <form novalidate class="md-layout">
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <md-field :class="getValidationClass('cate')">
            <label for="movies">category</label>
            <md-select v-model="form.cate" name="movies" id="movies" multiple :disabled="sending">
              <md-option value="tech">기술</md-option>
              <md-option value="uiux">UI/UX</md-option>
              <md-option value="trend">시장동향</md-option>
              <md-option value="etc">기타</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.cate.required">카테고리 범주를 선택하세요</span>
          </md-field>

        </div>
      </div>




      <md-field :class="getValidationClass('name')">
        <label for="title">도서명</label>
        <md-input name="title" id="title" autocomplete="given-name" v-model="form.name" :disabled="sending" />
        <span class="md-error" v-if="!$v.form.name.required">도서명을 입력하세요</span>
      </md-field>


      <md-field :class="getValidationClass('desc')">
        <label for="desc">세부정보</label>
        <md-input name="desc" id="desc" v-model="form.desc" :disabled="sending" />
        <span class="md-error" v-if="!$v.form.desc.required">도서 정보를 입력하세요</span>
      </md-field>

      <md-field :class="getValidationClass('thumb')">
        <label for="thumb">도서 이미지</label>
        <md-input name="thumb" id="thumb" v-model="form.thumb"  class="url"  @blur="showImage"  :disabled="sending" />
        <span class="md-helper-text">import imageURL http://~</span>
        <span class="md-error" v-if="!$v.form.desc.required">이미지 url 입력하세요</span>
      </md-field>

      <md-field md-inline :class="getValidationClass('refUrl')">
        <label for="refUrl">참조 링크</label>
        <md-input name="refUrl" id="refUrl" v-model="form.refUrl"  class="url"  :disabled="sending" />
        <span class="md-error" v-if="!$v.form.refUrl.required">참조 링크 입력하세요</span>
      </md-field>

      <md-field class="date" :class="getValidationClass('date')">
        <md-datepicker v-model="form.date" :md-disabled-dates="disabledDates" :disabled="sending" />
        <span class="md-error" v-if="!$v.form.date.required">등록일 선택하세요</span>
      </md-field>

      <div class="thumbnail" v-show="isThumb">
        등록할 책 표지 미리보기<br />
        <img :src="form.thumb" alt="">
      </div>
    </form>
    <md-card-actions>
      <md-button class="btn md-raised md-accent" @click.prevent="validateUser" :disabled="sending">write</md-button>
    </md-card-actions>







    <md-progress-bar md-mode="indeterminate" v-if="sending" />
    <md-snackbar :md-active.sync="userSaved">등록이 완료 되었습니다!</md-snackbar>
  </div>
</template>

<script>
  import { urlExp } from '../common/util';
  import { validationMixin } from 'vuelidate'
  import {
    name,
    date,
    maxLength,
    required
  } from 'vuelidate/lib/validators'
  import firebase from 'firebase';

  export default {
    name: 'Write',
    mixins: [validationMixin],
    data: () => ({
      isThumb: false,
      disabledDates: date => {
        const day = date.getDay()

        return day === 6 || day === 0
      },
      form: {
        cnt: 0,
        state: 0,
        name: null,
        desc: null,
        date: null,
        thumb: null,
        refUrl: null,
        cate: []
      },
      userSaved: false,
      sending: false,
    }),
    validations: {
      form: {
        cate: {
          required,
        },
        name: { required },
        desc: { required },
        thumb: { required },
        refUrl: { required },
        date: { required }
      }
    },

    methods: {
      showImage (){
        this.isThumb = urlExp(this.form.thumb);
      },
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
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.sending = true;

          setTimeout(() => {
            firebase.database().ref('books/list').push(this.form, (error) => {
              if (error) {
                console.log('Error has occured during saving process')
              } else {
                // success
                this.userSaved = true;
                this.sending = false;
                this.clearForm()
              }
            })
          }, 1300)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  #write{
    box-sizing: border-box;
    padding: 10px 20px;
    .btn{
      margin: 0;
      width: 100%;
    }
    .url{
      font-size: 11px;
    }
    .md-card-actions{
      padding: 0;
      margin: 0 0 30px;
      width: 100%;
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
