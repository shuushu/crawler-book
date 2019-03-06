<template>
  <div id='app' :class="classes.isOnepage">
      <Header v-if="!this.onepage" />
      <router-view></router-view>
      <Footer v-if="!this.onepage" />

      <!-- dialog -->
      <md-dialog-alert v-if="popupAlert.isShow"
        :md-active.sync="popupAlert.isShow"
        :md-content="popupAlert.message"
        md-confirm-text="확인"
      />



      <md-dialog-confirm v-if="popupConfirm.isShow"
        :md-active.sync="popupConfirm.isShow"
        :md-title="popupConfirm.name"
        :md-content="popupConfirm.message"
        @md-confirm="popupConfirm.action(popupConfirm)"
      />

  </div>
</template>


<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import { mapState } from 'vuex';
const onepageList = ['login']

export default {
  name: 'app',
  components: {Footer, Header},
  data () {
    return {
      onepage: false
    }
  },
  computed: {
    classes() {
      return {
        isOnepage: {
          'onepage': this.onepage
        }
      }
    },
    ...mapState({
      popupAlert: state => state.popupAlert,
      popupConfirm: state => state.popupConfirm
    })
  },
  watch: {
    $route () {
      this.routeUpdate()
    }
  },
  methods: {
    routeUpdate () {
      const { name } = this.$route;

      this.onepage = onepageList.includes(name);
    }
  },
  created () {
    this.routeUpdate();
  }

}
</script>

<style lang="scss">
  .md-empty-state-wrap{
    position: fixed;
    height: 100%;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: -1;
    .md-empty-state{
      padding: 0;
    }
  }
  #app{
    overflow: hidden;
    padding: 56px 0;
    &.onepage{
      padding: 0;
    }
  }
  .item-list-wrap{
    padding: 0 16px;
  }
  .md-list {
    width: 100%;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
  }
  #container{
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    border: 1px solid #000;
  }
  .md-bottom-bar>.md-ripple{
    justify-content: space-between;
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
</style>
