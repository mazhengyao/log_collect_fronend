import Vue from 'vue'
import App from './App.vue'
import log_form from "./components/log_form";
import VueRouter from "vue-router"; // 引入路由
import axios from 'axios'
import echarts from 'echarts'
import mammoth from 'mammoth'

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$mammoth = mammoth

Vue.use(VueRouter) // 使用中间件使用路由

const router = new VueRouter({
  routes: [
    {
      path: '/log_form',
      component: log_form
    },
  ]
})

new Vue({
  el: '#app',
  router, // 将定义好的路由router应用到全局
  render: h => h(App)
})
