<template>
  <div id='app' :class="classes.isOnepage">
      <Header v-if="!this.onepage" />
      <router-view></router-view>
      <Footer v-if="!this.onepage" />
  </div>
</template>


<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

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
    }
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
</style>
