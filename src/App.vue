<template>
  <div id="app">
    <h1 class="title">{{ msg }}</h1>
    <router-link class="link" to="/editchart">Edit Chart</router-link>
    <p class="division">|</p>
    <router-link class="link" to="/dragchart">Drag Chart</router-link>
    <div class="black"></div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Chart Box',
      }
    },
    computed: {},
    mounted() {
    },
    methods: {}
  }
</script>

<style>
  html {
    background-color: whitesmoke;
  }

  .title {
    color: darkgreen;
    font-weight: 700;
    font-size: 40px;
    font-family: Candara;
    margin: 0;
  }

  .link{
    color: darkslategrey;
    font-weight: 700;
    font-size: 25px;
    font-family: Candara;
    margin: 0;
    text-decoration: none;
  }

  .division{
    display: inline;
    color: darkslategrey;
    font-weight: 700;
    font-size: 30px;
    font-family: Candara;
    margin: 0;
  }

  .black{
    width: 100%;
    height: 20px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*margin-top: 60px;*/
    -webkit-touch-callout: none; /*系统默认菜单被禁用*/
    -webkit-user-select: none; /*webkit浏览器*/
    /*-khtml-user-select:none; !*早期浏览器*!*/
    -moz-user-select: none; /*火狐*/
    -ms-user-select: none; /*IE10*/
    user-select: none;
  }

</style>
