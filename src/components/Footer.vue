<template>
  <md-bottom-bar md-type="shift" md-sync-route>
    <md-bottom-bar-item to="/list" id="bottom-bar-item-home" md-label="list" md-icon="home"></md-bottom-bar-item>
    <md-bottom-bar-item to="/write" id="bottom-bar-item-pages" md-label="registered" md-icon="pages"></md-bottom-bar-item>
    <md-bottom-bar-item to="/rental" id="bottom-bar-item-posts" md-label="rental" md-icon="book"></md-bottom-bar-item>
    <md-bottom-bar-item id="bottom-bar-item-favorites" md-label="Favorites" md-icon="favorite"></md-bottom-bar-item>
  </md-bottom-bar>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>

<style lang="scss" scoped>
  .md-bottom-bar {
    position: fixed;
    bottom: 0;
    z-index: 10;
  }
</style>
